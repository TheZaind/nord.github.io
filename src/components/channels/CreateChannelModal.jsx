import React, { useState } from 'react';
import { useChannels } from '../../context/ChannelContext';
import Modal from '../common/Modal';
import Button from '../common/Button';

const CreateChannelModal = ({ isOpen, onClose }) => {
  const { createChannel } = useChannels();
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!channelName.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await createChannel({
        name: channelName.trim().toLowerCase().replace(/\s+/g, '-'),
        description: description.trim()
      });
      
      // Reset form
      setChannelName('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Failed to create channel:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setChannelName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Text Channel"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="channelName" className="block text-sm font-medium text-white mb-2">
            Channel Name
          </label>
          <input
            type="text"
            id="channelName"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="e.g. general"
            className="discord-input"
            maxLength={50}
            required
          />
          <p className="mt-1 text-xs text-discord-gray-lighter">
            Channel names must be lowercase and cannot contain spaces or special characters.
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this channel about?"
            className="discord-input resize-none"
            rows={3}
            maxLength={200}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!channelName.trim() || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Channel'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
