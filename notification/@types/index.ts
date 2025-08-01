export type NotificationType = {
     user_id: number;
     socket_id?: string;
     notification_content?: [];
     device_token?: string;
     push_notification?: boolean;
};

export type ContentType = {
     subject: string;
     body: object;
     type: string;
     view: boolean;

     notification_id?: string;
};

export type Payload = {
     id: number;
     first_name?: string;
     last_name?: string;
     email: string;
};
export type KafkaEvent = {
     event_type: string;
     content: { [key: string]: any };
};

export type NotificationContent = NotificationType & ContentType;
