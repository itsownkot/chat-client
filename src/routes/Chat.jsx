import { useEffect, useState, useRef } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import smile from "../assets/smile.png";

const socket = io.connect(import.meta.env.VITE_HOST);

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  const room = url.searchParams.get("room");
  return { name, room };
};

const Chat = () => {
  const firstRend = useRef(true);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [roomCount, setRoomCount] = useState(0);
  const searchParams = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    if (firstRend.current) {
      socket.emit("join", searchParams);
      socket.on("message", ({ data }) => {
        setMessages((prev) => [...prev, data]);
      });
      socket.on("room", ({ data }) => {
        setRoomCount(data.users.length);
      });
      firstRend.current = false;
    }
  }, []);

  const handleChange = ({ target: { value } }) => {
    setMessage(value);
  };

  const onEmojiClick = ({ emoji }) => setMessage((prev) => `${prev}${emoji}`);

  const sendMessage = () => {
    setEmojiOpen(false);
    if (!message) return;

    socket.emit("sendMessage", { message, searchParams });

    setMessage("");
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom", { searchParams });
    navigate("/");
  };

  return (
    <section className="w-full h-full md:w-[70%] md:h-[70%] rounded-md bg-zinc-800 flex flex-col">
      <header className="h-[15%] bg-zinc-700 rounded-t-md flex justify-between items-center px-6 md:px-3">
        <div className="text-gray-200 font-bold">{searchParams.room}</div>
        <div className="text-zinc-500">{roomCount} users</div>
        <button
          onClick={leaveRoom}
          className="px-2 py-1 rounded-md bg-red-500 hover:bg-red-400 transition font-semibold text-gray-200"
        >
          Left the room
        </button>
      </header>
      <main className="flex-1 px-3 py-2 text-gray-200 flex flex-col gap-3 overflow-y-auto">
        {messages.map((message, i) => {
          const me =
            message.user.name.trim().toLowerCase() ===
            searchParams.name.trim().toLowerCase();
          return (
            <div
              key={i}
              className={`flex flex-col gap-1 ${
                me ? "self-end" : "self-start"
              }`}
            >
              <span>{message.user.name}</span>
              <span
                className={` ${
                  me ? "bg-blue-500" : "bg-zinc-500"
                } rounded-md py-1 px-2`}
              >
                {message.message}
              </span>
            </div>
          );
        })}
      </main>
      <footer className="relative h-[10%] rounded-b-md bg-zinc-700 flex items-center justify-between px-6 md:px-3">
        <input
          type="text"
          name="message"
          placeholder="Type smth"
          value={message}
          autoComplete="off"
          className="basis-1/2 md:basis-2/3 h-full bg-transparent text-zinc-300 outline-none py-1"
          onChange={handleChange}
        />
        <div className="">
          <img
            src={smile}
            alt="smile"
            onClick={() => setEmojiOpen(!emojiOpen)}
            className="w-[30px] h-[30px] cursor-pointer"
          />
          {emojiOpen && (
            <div className="absolute bottom-[90%] right-[5%]">
              <EmojiPicker onEmojiClick={onEmojiClick} width={300} />
            </div>
          )}
        </div>
        <input
          type="submit"
          value="Send"
          onClick={sendMessage}
          className="text-gray-200 font-semibold bg-blue-500 rounded-md px-2 cursor-pointer"
        />
      </footer>
    </section>
  );
};
export default Chat;
