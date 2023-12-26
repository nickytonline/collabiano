import usePartySocket from "partysocket/react";
import { useEffect, useState } from "react";
import type { ChatMessage } from "../../party";

const host = import.meta.env.PUBLIC_PARTYKIT_HOST ?? "localhost:1999";

interface PartyProps {
  username: string;
  roomId: string;
}

export const Party = ({ username, roomId }: PartyProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socket = usePartySocket({
    host,
    room: roomId,
    onMessage(event) {
      const message = JSON.parse(event.data) as ChatMessage;

      if (message.text) {
        setMessages((messages) => [...messages, message]);
      }
    },
  });

  useEffect(() => {
    return () => {
      socket.close();
    };
  }, [socket]);

  return (
    <div className="grid place-content-center m-4">
      <h2>{roomId} Room</h2>
      <form
        className="mt-2 flex flex-col gap-4"
        onSubmit={(event) => {
          const form = new FormData(event.target as HTMLFormElement);
          const text = form.get("message").valueOf();

          socket.send(JSON.stringify({ user: username, text }));
          event.preventDefault();
        }}
      >
        <div className="flex gap-2 items-center">
          <label className="flex gap-2 items-center">
            <span>Message</span>
            <input
              className="border border-gray-400 rounded p-2"
              name="message"
              type="text"
            />
          </label>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Send message
          </button>
        </div>
      </form>

      <ul className="my-4 grid gap-2">
        {messages.map(({ user, text }) => (
          <li key={`${user}_${text}`} className="flex gap-2">
            <span className="font-bold">{user}:</span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
