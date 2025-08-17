// NotificationSlider.tsx
import React from 'react';
import { NotificationSliderMobile } from './NotificationSliderMobile';
import { NotificationSliderDesktop } from './NotificationSliderDesktop';

interface Webinar {
  id: string;
  title: string;
  date: string;
  thumbnail: string;
  zoomLink: string;
  packageId: string;
}

interface Props {
  webinars: Webinar[];
  interval?: number;
}

interface NotificationSliderProps {
  webinars: Webinar[];
  interval?: number;
}
export const NotificationSlider: React.FC<NotificationSliderProps> = (props) => (
  <>
    <div className="block lg:hidden">
      <NotificationSliderMobile {...props} />
    </div>
    <div className="hidden lg:block">
      <NotificationSliderDesktop {...props} />
    </div>
  </>
);
