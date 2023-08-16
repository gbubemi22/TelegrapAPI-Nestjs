export interface Message {
  date: number;
  message: string;
  id: number;

  /** ID of the sender of the message */
  from_id: PeerUser;

  /** Peer ID, the chat where this message was sent */
  peer_id: PeerUser;

  /** ID of the inline bot that generated the message */
  via_bot_id: number;

  /** Is this an outgoing message */
  out: boolean;

  messageMedia: MessageMedia;

  media: MessageMediaDocument;
}

export interface MessageMedia {
  photo: Photo;
}

interface PeerUser {
  user_id: number;
}

export interface MessageMedia {
  photo: Photo;
}

interface Photo {
  has_stickers: boolean; // flags.0?true    Whether the photo has mask stickers attached to it
  id: number; //ID
  access_hash: number; //Access hash
  file_reference: number; //    file reference
  date: number; //  Date of upload
  sizes: PhotoSize[]; // Available sizes for download
  video_sizes: VideoSize[]; //For animated profiles, the MPEG4 videos
  dc_id: number; // DC ID to use for download
}

interface PhotoSize {
  type: string;
  w: number;
  h: number;
  size: number;
}

interface VideoSize {
  type: string;
  w: number;
  h: number;
  size: number;
  video_start_ts: number;
}

interface MessageMediaDocument {
  document: TelegramDocument;
}

interface TelegramDocument {
  id: string;
  access_hash: string;
  file_reference: number[];
  date: number;
  mime_type: string;
  thumbs: [];
  dc_id: number;
  attributes: Attribute[];
}

interface Attribute {
  _: string;
  file_name: string;
}
