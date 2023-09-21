import { Form, Link } from "react-router-dom";
import { useState } from "react";

const Main = () => {
  const [chatData, setChatData] = useState({ name: "", room: "" });

  function handleChange({ target: { value, name } }) {
    setChatData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-white text-3xl">Let's chat</h1>
      <Form className="flex flex-col gap-3">
        <input
          type="text"
          name="name"
          value={chatData.name}
          id=""
          autoComplete="off"
          className="bg-zinc-800 rounded-md text-zinc-300 outline-none px-3 py-1"
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="room"
          value={chatData.room}
          id=""
          autoComplete="off"
          className="bg-zinc-800 rounded-md text-zinc-300 outline-none px-3 py-1"
          onChange={handleChange}
          placeholder="Room"
        />
        <Link
          className="bg-blue-700 hover:bg-blue-600 transition rounded-md text-white p-1 flex justify-center items-center"
          onClick={(e) => {
            let isEmpty = Object.values(chatData).some((val) => !val);
            if (isEmpty) e.preventDefault();
          }}
          to={`chat?name=${chatData.name}&room=${chatData.room}`}
        >
          <button>Go chat</button>
        </Link>
      </Form>
    </div>
  );
};
export default Main;
