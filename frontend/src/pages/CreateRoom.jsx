import React, { useState, useEffect, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import socket from "../socket";

const CreateRoom = () => {
  const [files, setFiles] = useState([]);

  function getFile(e) {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  }

  async function sendFile(e) {
    e.preventDefault();
    console.log("Ready State:", dataChannel.current?.readyState);
    if (!dataChannel.current || dataChannel.current.readyState !== "open") {
      alert("Data channel not ready:Reload the page");
      return;
    }

    const CHUNK_SIZE = 256 * 1024;

    for (const file of files) {
      console.log("sending:", file.name);

      const buffer = await file.arrayBuffer();

      dataChannel.current.send(
        JSON.stringify({
          type: "metadata",
          name: file.name,
          mimeType: file.type,
          size: buffer.byteLength,
        }),
      );

      let offset = 0;

      while (offset < buffer.byteLength) {
        const chunk = buffer.slice(offset, offset + CHUNK_SIZE);

        dataChannel.current.send(chunk);

        offset += CHUNK_SIZE;

        while (dataChannel.current.bufferedAmount > 1024 * 1024) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }

      dataChannel.current.send(
        JSON.stringify({
          type: "end",
        }),
      );

      console.log("finished:", file.name);

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    alert("All files sent successfully");
  }

  const [roomId, setRoomId] = useState("");
  const [receiverJoined, setReceiverJoined] = useState(false);

  const peer = useRef(
    new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
      ],
    }),
  );

  const roomRef = useRef("");
  const dataChannel = useRef(null);
  const [btnText, setBtnText] = useState("Copy");

  async function copyId(roomId) {
    let ele = document.getElementById(roomId);
    let id = ele.innerText;
    try {
      await navigator.clipboard.writeText(id);
      console.log("copied");
      setBtnText("Copied");
    } catch (err) {
      console.log("cannot copy ", err);
    }
  }

  useEffect(() => {
    socket.emit("createRoom");

    socket.on("room-created", (roomId) => {
      setRoomId(roomId);
      roomRef.current = roomId;
    });

    socket.on("ans", async (ans) => {
      console.log("answer received");
      await peer.current.setRemoteDescription(ans);
      console.log("Remote description set on sender");
      console.log("connection established");
    });

    socket.on("receiver joined", async () => {
      setReceiverJoined(true);
      dataChannel.current = peer.current.createDataChannel("fileTransfer");

      dataChannel.current.onopen = () => {
        console.log("data channel open");
      };
      console.log("Creating offer...");
      let offer = await peer.current.createOffer();
      console.log("Offer created");
      await peer.current.setLocalDescription(offer);
      console.log("offer:", offer);

      socket.emit("offer", { roomId: roomRef.current, offer });
    });

    return () => {
      socket.off("offer");
      socket.off("ans");
      socket.off("receiver joined");
    };
  }, []);

  useEffect(() => {
    peer.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("sender ice");
        socket.emit("ice-candidate", {
          roomId: roomRef.current,
          candidate: event.candidate,
        });
      }
    };
  }, []);

  useEffect(() => {
    socket.on("ice-candidate", async (candidate) => {
      console.log("sender received ice");
      if (peer.current.remoteDescription) {
        await peer.current.addIceCandidate(candidate);
      }
    });

    peer.current.onconnectionstatechange = () => {
      console.log("Connection:", peer.current.connectionState);
    };

    return () => {
      socket.off("ice-candidate");
      peer.current.close();
    };
  }, []);

  return (
    <div className="h-screen flex justify-center items-center bg-black">
      <div
        className={`popup h-1/2 w-3/4 md:h-3/4 md:w-3/4 bg-green-100 border-green-400 border-r-10 border-b-10 ${receiverJoined ? "hidden" : "flex"} flex-col justify-center items-center rounded-4xl`}
      >
        <h1 className="hidden md:block md:text-4xl">
          Room created successfully
        </h1>
        <h2 className="mt-4 text-3xl font-bold" id="roomId">
          {roomId}
        </h2>
        <button
          id="copyBtn"
          onClick={() => copyId("roomId")}
          className="mt-4 px-15 text-xl font-bold py-3 bg-green-400 rounded-2xl"
        >
          {btnText}
        </button>
        <br />
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
        <h2>Waiting for user to connect....</h2>
      </div>

      <div
        className={`text-white h-screen w-full ${receiverJoined ? "flex" : "hidden"} justify-center items-center flex-col`}
      >
        <h1 className="mb-4 text-2xl">(Room ID: {roomId})</h1>
        <h1 className="text-center text-2xl">Upload Files</h1> <br />
        <form
          action=""
          onSubmit={sendFile}
          className="flex flex-col md:flex-row items-center gap-5 justify-center"
        >
          <div>
            <input
              type="file"
              onChange={getFile}
              className="
                    w-full
                    text-sm
                    text-gray-700
                    rounded-xl
                    cursor-pointer
                    bg-white
                    file:mr-4
                    file:py-2
                    file:px-4
                    file:rounded-lg
                    file:border-0
                    file:text-sm
                    file:font-semibold
                    file:bg-green-200
                    file:text-black
                    hover:file:bg-green-300
                    p-2
                "
              multiple
            />
          </div>
          <div>
            <input
              type="submit"
              className="px-10 py-3 bg-green-300 rounded-xl hover:bg-green-400 hover:cursor-pointer text-black"
            />
          </div>
        </form>
        <div className="h-100 w-full md:w-2/4 flex flex-col gap-2 overflow-y-auto rounded-2xl mt-10">
          {files.map((file, idx) => {
            return (
              <div
                key={idx}
                className="h-10 w-full flex flex-shrink-0 justify-center items-center bg-purple-400 rounded-2xl"
              >
                <h1 className="text-white">{file.name}</h1>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
