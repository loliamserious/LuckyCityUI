import React from 'react';
import {
  TwitterShareButton,
  FacebookShareButton,
  WhatsappShareButton,
  XIcon,
  FacebookIcon,
  WhatsappIcon,
} from 'react-share';

interface ShareButtonsProps {
  city: string;
  rate: number;
  reason: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ city, rate, reason }) => {
  const shareUrl = window.location.href;
  const title = `I found my lucky city: ${city} (${rate}% match)! ✨`;
  const hashtags = ['LuckyCity', 'FengShui'];

  return (
    <div className="flex items-center space-x-1">
      <TwitterShareButton
        url={shareUrl}
        title={title}
        hashtags={hashtags}
      >
        <XIcon size={24} round className="hover:opacity-80 transition-opacity" />
      </TwitterShareButton>

      <FacebookShareButton
        url={shareUrl}
        hashtag="#LuckyCity"
      >
        <FacebookIcon size={24} round className="hover:opacity-80 transition-opacity" />
      </FacebookShareButton>

      <WhatsappShareButton
        url={shareUrl}
        title={`${title}\n${reason}`}
      >
        <WhatsappIcon size={24} round className="hover:opacity-80 transition-opacity" />
      </WhatsappShareButton>
    </div>
  );
};
