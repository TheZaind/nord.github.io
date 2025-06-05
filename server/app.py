import json
import os
import uuid
import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
from werkzeug.utils import secure_filename
import magic
from PIL import Image

app = Flask(__name__)
app.config['SECRET_KEY'] = 'discord-clone-secret-key'
app.config['UPLOAD_FOLDER'] = 'data/uploads'
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max file size

# Enable CORS for all routes with more explicit configuration
CORS(app, 
     resources={r"/*": {"origins": "*"}},
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     supports_credentials=True)

# Initialize SocketIO with CORS enabled (using threading instead of eventlet for Windows compatibility)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Add explicit CORS headers for all responses
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin:
        response.headers.add('Access-Control-Allow-Origin', origin)
    else:
        response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('data/channels', exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {
    'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 
    'mp4', 'webm', 'mp3', 'wav', 'ogg', 'zip', 'rar', 
    'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_channel_file(channel_id):
    return f'data/channels/{channel_id}.json'

def load_channel_messages(channel_id):
    """Load messages for a specific channel"""
    file_path = get_channel_file(channel_id)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_channel_messages(channel_id, messages):
    """Save messages for a specific channel"""
    file_path = get_channel_file(channel_id)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)

def create_thumbnail(image_path, thumbnail_path, size=(300, 200)):
    """Create a thumbnail for images"""
    try:
        with Image.open(image_path) as img:
            img.thumbnail(size, Image.Resampling.LANCZOS)
            img.save(thumbnail_path, optimize=True, quality=85)
        return True
    except Exception as e:
        print(f"Error creating thumbnail: {e}")
        return False

# Connected users
connected_users = {}

# Handle preflight OPTIONS requests
@app.route('/api/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    response = jsonify()
    origin = request.headers.get('Origin')
    if origin:
        response.headers.add('Access-Control-Allow-Origin', origin)
    else:
        response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.route('/api/health')
def health_check():
    return jsonify({"status": "online", "timestamp": datetime.datetime.now().isoformat()})

@app.route('/api/channels/<channel_id>/messages')
def get_channel_messages(channel_id):
    """Get all messages for a specific channel"""
    messages = load_channel_messages(channel_id)
    return jsonify(messages)

@app.route('/api/channels/<channel_id>/messages', methods=['POST'])
def post_message_http(channel_id):
    """Post a new message via HTTP (fallback for WebSocket)"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract message and user info
        message_data = data.get('message', {})
        user_info = data.get('user', {})
        
        if not user_info or not user_info.get('id') or not user_info.get('username'):
            return jsonify({"error": "User information required"}), 400
        
        # Create message object
        message = {
            'id': str(uuid.uuid4()),
            'user_id': user_info['id'],
            'username': user_info['username'],
            'content': message_data.get('content', ''),
            'type': message_data.get('type', 'text'),
            'file': message_data.get('file'),
            'timestamp': datetime.datetime.now().isoformat(),
            'channel_id': channel_id
        }
        
        # Load existing messages
        messages = load_channel_messages(channel_id)
        messages.append(message)
        
        # Save messages
        save_channel_messages(channel_id, messages)
        
        print(f"New HTTP message in {channel_id} from {user_info['username']}: {message['content']}")
        
        return jsonify({"success": True, "message": message})
        
    except Exception as e:
        print(f"Error posting message via HTTP: {e}")
        return jsonify({"error": "Failed to post message"}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle file uploads"""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        # Generate unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        # Save file
        file.save(file_path)
        
        # Get file info
        file_size = os.path.getsize(file_path)
        file_type = magic.from_file(file_path, mime=True)
        
        # Create thumbnail for images
        thumbnail_url = None
        if file_type.startswith('image/'):
            thumbnail_filename = f"thumb_{unique_filename}"
            thumbnail_path = os.path.join(app.config['UPLOAD_FOLDER'], thumbnail_filename)
            if create_thumbnail(file_path, thumbnail_path):
                thumbnail_url = f"/api/files/{thumbnail_filename}"
        
        file_info = {
            "id": str(uuid.uuid4()),
            "filename": filename,
            "unique_filename": unique_filename,
            "size": file_size,
            "type": file_type,
            "url": f"/api/files/{unique_filename}",
            "thumbnail_url": thumbnail_url,
            "uploaded_at": datetime.datetime.now().isoformat()
        }
        
        return jsonify(file_info)
    
    return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/files/<filename>')
def serve_file(filename):
    """Serve uploaded files"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# WebSocket Events
@socketio.on('connect')
def on_connect():
    print(f'User connected: {request.sid}')
    emit('connected', {'sid': request.sid})

@socketio.on('disconnect')
def on_disconnect():
    user_id = connected_users.pop(request.sid, None)
    if user_id:
        print(f'User disconnected: {user_id}')
        # Notify other users about disconnect
        emit('user_disconnected', {'user_id': user_id}, broadcast=True, include_self=False)

@socketio.on('join_user')
def on_join_user(data):
    """User joins with their information"""
    user_info = data['user']
    connected_users[request.sid] = user_info
    
    print(f"User joined: {user_info['username']} ({user_info['id']})")
    
    # Notify other users about new connection
    emit('user_connected', {'user': user_info}, broadcast=True, include_self=False)
    
    # Send current online users to the new user
    online_users = list(connected_users.values())
    emit('online_users', {'users': online_users})

@socketio.on('join_channel')
def on_join_channel(data):
    """User joins a specific channel"""
    channel_id = data['channel_id']
    user_info = connected_users.get(request.sid)
    
    if user_info:
        join_room(channel_id)
        print(f"User {user_info['username']} joined channel {channel_id}")
        
        # Load and send existing messages
        messages = load_channel_messages(channel_id)
        emit('channel_messages', {'channel_id': channel_id, 'messages': messages})
        
        # Notify others in the channel
        emit('user_joined_channel', {
            'user': user_info,
            'channel_id': channel_id
        }, room=channel_id, include_self=False)

@socketio.on('leave_channel')
def on_leave_channel(data):
    """User leaves a specific channel"""
    channel_id = data['channel_id']
    user_info = connected_users.get(request.sid)
    
    if user_info:
        leave_room(channel_id)
        print(f"User {user_info['username']} left channel {channel_id}")
        
        # Notify others in the channel
        emit('user_left_channel', {
            'user': user_info,
            'channel_id': channel_id
        }, room=channel_id, include_self=False)

@socketio.on('send_message')
def on_send_message(data):
    """Handle new message"""
    channel_id = data['channel_id']
    message_data = data['message']
    user_info = connected_users.get(request.sid)
    
    if not user_info:
        emit('error', {'message': 'User not authenticated'})
        return
    
    # Create message object
    message = {
        'id': str(uuid.uuid4()),
        'user_id': user_info['id'],
        'username': user_info['username'],
        'content': message_data.get('content', ''),
        'type': message_data.get('type', 'text'),
        'file': message_data.get('file'),
        'timestamp': datetime.datetime.now().isoformat(),
        'channel_id': channel_id
    }
    
    # Load existing messages
    messages = load_channel_messages(channel_id)
    messages.append(message)
    
    # Save messages
    save_channel_messages(channel_id, messages)
    
    print(f"New message in {channel_id} from {user_info['username']}: {message['content']}")
    
    # Broadcast message to all users in the channel
    emit('new_message', {
        'channel_id': channel_id,
        'message': message
    }, room=channel_id)

@socketio.on('typing_start')
def on_typing_start(data):
    """User started typing"""
    channel_id = data['channel_id']
    user_info = connected_users.get(request.sid)
    
    if user_info:
        emit('user_typing', {
            'user': user_info,
            'channel_id': channel_id,
            'typing': True
        }, room=channel_id, include_self=False)

@socketio.on('typing_stop')
def on_typing_stop(data):
    """User stopped typing"""
    channel_id = data['channel_id']
    user_info = connected_users.get(request.sid)
    
    if user_info:
        emit('user_typing', {
            'user': user_info,
            'channel_id': channel_id,
            'typing': False
        }, room=channel_id, include_self=False)

if __name__ == '__main__':
    print("🚀 Discord Clone Server starting...")
    print("📂 Upload folder:", app.config['UPLOAD_FOLDER'])
    print("🌐 Server will be available at: http://localhost:5000")
    print("📡 WebSocket enabled for real-time messaging")
    
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
