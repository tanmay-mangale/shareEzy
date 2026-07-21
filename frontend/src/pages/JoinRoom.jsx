import React, { useState, useEffect, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import socket from "../socket";
import { Download } from "lucide-react";

const JoinRoom = () => {
  const [code, setCode] = useState("");
  const [receivedFiles, setReceivedFiles] = useState([]);

  function codeInputField(e) {
    let code = e.target.value;
    setCode(code);
    codeRef.current = code;
  }

  function join(e) {
    e.preventDefault();
    socket.emit("join-room", code);
  }

  const [joined, setJoined] = useState(false);

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

  const pendingCandidates = useRef([]);
  const codeRef = useRef("");

  useEffect(() => {
    peer.current.ondatachannel = (event) => {
      console.log("✅ DataChannel received");
      const channel = event.channel;

      channel.binaryType = "arraybuffer";

      let currentFile = {
        name: "",
        mimeType: "",
        size: 0,
        receivedBytes: 0,
        chunks: [],
      };

      channel.onmessage = (event) => {
        console.log("Received:", typeof event.data);
        if (typeof event.data === "string") {
          const parsedData = JSON.parse(event.data);

          if (parsedData.type === "metadata") {
            currentFile = {
              name: parsedData.name,
              mimeType: parsedData.mimeType,
              size: parsedData.size,
              receivedBytes: 0,
              chunks: [],
            };

            setReceivedFiles((prev) => [
              ...prev,
              {
                name: currentFile.name,
                url: "",
                progress: 0,
                completed: false,
              },
            ]);

            console.log("receiving:", currentFile.name);
          } else if (parsedData.type === "end") {
            const finishedFileName = currentFile.name;
            const blob = new Blob(currentFile.chunks, {
              type: currentFile.mimeType,
            });
            const fileURL = URL.createObjectURL(blob);

            setReceivedFiles((prev) =>
              prev.map((file) =>
                file.name === finishedFileName
                  ? { ...file, url: fileURL, progress: 100, completed: true }
                  : file,
              ),
            );

            channel.send(JSON.stringify({ type: "ack" }));

            currentFile = {
              name: "",
              mimeType: "",
              size: 0,
              receivedBytes: 0,
              chunks: [],
            };
          }
        } else {
          // binary chunk branch — event.data is an ArrayBuffer here
          currentFile.chunks.push(event.data);
          currentFile.receivedBytes += event.data.byteLength;

          const progress = (currentFile.receivedBytes / currentFile.size) * 100;

          setReceivedFiles((prev) =>
            prev.map((file) =>
              file.name === currentFile.name ? { ...file, progress } : file,
            ),
          );
        }
      };
    };
    socket.on("join-successfully", () => {
      setJoined(true);
    });

    socket.on("Room not found", (msg) => {
      alert(msg);
    });

    socket.on("offer", async (offer) => {
      console.log("offer received");
      await peer.current.setRemoteDescription(offer);
      while (pendingCandidates.current.length > 0) {
        const candidate = pendingCandidates.current.shift();

        await peer.current.addIceCandidate(candidate);

        console.log("Queued ICE added");
      }
      console.log("Remote description set on receiver");

      let ans = await peer.current.createAnswer();
      console.log("Answer created");

      await peer.current.setLocalDescription(ans);
      console.log("Local description set");

      socket.emit("ans", { roomId: codeRef.current, ans });
      console.log("Answer sent");
    });

    return () => {
      socket.off("join-successfully");
      socket.off("Room not found");
      socket.off("offer");
    };
  }, []);

  useEffect(() => {
    peer.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("receiver ice");

        socket.emit("ice-candidate", {
          roomId: codeRef.current,
          candidate: event.candidate,
        });
      }
    };
  }, []);

  useEffect(() => {
    socket.on("ice-candidate", async (candidate) => {
      console.log("receiver got ice");
      if (peer.current.remoteDescription) {
        await peer.current.addIceCandidate(candidate);
        console.log("ICE candidate added");
      } else {
        console.log("ICE queued");
        pendingCandidates.current.push(candidate);
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
    <div className="h-screen w-full bg-black flex justify-center items-center">
      <div
        className={`h-1/2 w-full ${joined ? "hidden" : "flex"} flex-col items-center justify-center text-white  mb-30 md:mb-0`}
      >
        <div className="flex flex-col items-center justify-center gap-5">
          <div>
            <h1 className="text-2xl">Enter Room ID</h1>
          </div>
          <form onSubmit={join}>
            <input
              type="text"
              value={code}
              onChange={codeInputField}
              className="bg-white px-2 text-center w-60 md:w-100 rounded-l-2xl text-xl py-4 text-black"
            />
            <input
              type="submit"
              value="Join"
              className="bg-green-300 py-4 px-5  text-xl rounded-r-2xl text-black"
            />
          </form>
        </div>
      </div>

      <div
        className={`h-full md:h-3/4 ${
          joined ? "block" : "hidden"
        } w-full md:w-3/4 md:border-2 md:border-dashed border-white md:rounded-2xl py-5 md:py-10 px-3 md:px-10`}
      >
        <div className="h-full w-full flex flex-col gap-4 md:gap-8 overflow-y-auto">
          {receivedFiles.map((file, idx) => (
            <div
              key={idx}
              className="w-full min-h-24 flex flex-col md:flex-row justify-between md:items-center gap-4 px-4 md:px-8 py-4 border-b-4 border-r-4 bg-gray-100 rounded-2xl flex-shrink-0"
            >
              <div className="w-full md:mr-10">
                <h1 className="break-all">{file.name}</h1>

                <div className="w-full bg-gray-300 h-2 rounded mt-2 overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all duration-200"
                    style={{
                      width: `${file.progress || 0}%`,
                    }}
                  />
                </div>

                <p className="text-sm mt-1">
                  {Math.floor(file.progress || 0)}%
                </p>
              </div>

              <div className="w-full md:w-auto">
                <a
                  href={file.url}
                  download={file.name}
                  className={`px-5 py-3 rounded-xl flex items-center justify-center gap-2 w-full md:w-auto ${
                    file.completed
                      ? "bg-green-300"
                      : "bg-gray-400 pointer-events-none"
                  }`}
                >
                  Download <Download size={20} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
