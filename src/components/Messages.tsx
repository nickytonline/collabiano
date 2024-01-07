import { useRef } from "react";
import type { CollabianoMessage } from "../../party";

interface MessagesProps {
  messages: CollabianoMessage[];
}

export const Messages = ({ messages }: MessagesProps) => {
  const endOfListRef = useRef<HTMLLIElement>(null);
  endOfListRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <details>
      <summary className="cursor-pointer text-2xl">Messages</summary>
      <ul className="overflow-y-scroll h-36">
        {messages.map(({ username, message, type }, index) => (
          <li
            key={index}
            className={`p-2 rounded flex gap-2 w-max ${
              type === "powerup" ? "bg-black text-yellow-300" : ""
            }`}
          >
            <span>{username}:</span>
            <span>{message}</span>
            {type === "note" ? <span>🎵</span> : null}
          </li>
        ))}
        <li ref={endOfListRef} />
      </ul>
    </details>
  );
};
