import { SyntheticEvent, useEffect, useRef, useState } from "react";

import { AiOutlineArrowDown } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import { ErrorMsg, LoadingSpinner, Modal, TwButton } from "components";

import MessageBox from "./MessageBox";
import ChatHeader from "./ChatHeader";
import ChatForm from "./ChatForm";
import { Message, User } from "interfaces";
import { useAppSelector } from "app/hooks";
import { getChatState } from "features/inbox/chatReducer";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "services/firebase";
import { start_chatting } from "assets/images";
import { getUserState } from "features/authentication/userSlice";

interface ChatBoxProps {
  recipient: User;
}

const ChatBox = ({ recipient }: ChatBoxProps) => {
  const [showArrowDown, setShowArrowDown] = useState(false);

  const conversationContainer = useRef<HTMLDivElement>(null);
  const latestMsg = useRef<HTMLButtonElement>(null);

  const [messages, setMessages] = useState<[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);

  const { chatId } = useAppSelector(getChatState);
  const { user: currentUser } = useAppSelector(getUserState);

  const scrollDown = () => {
    latestMsg?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const chatBoxScrollHandler = (event: SyntheticEvent) => {
    const target = event.currentTarget;
    if (target.scrollHeight - target.scrollTop > target.clientHeight + 300) {
      setShowArrowDown(true);
    } else {
      setShowArrowDown(false);
    }
  };

  useEffect(() => {
    if (!latestMsg.current) return;
    latestMsg.current.scrollIntoView();
  }, [messages, latestMsg.current]);

  useEffect(() => {
    setIsPending(true);
    setMessages([]);

    const conversationDocRef = doc(db, "chats", chatId);
    const userChatDocRef = doc(db, "userChats", currentUser.uid);

    // Seen the conversation
    updateDoc(userChatDocRef, {
      [chatId + ".seen"]: true,
      [chatId + ".active"]: true,
    });

    const unsub = onSnapshot(conversationDocRef, (doc) => {
      doc.exists() && setMessages(doc.data().messages);

      setIsPending(false);
    });

    return () => {
      updateDoc(userChatDocRef, {
        [chatId + ".active"]: false,
      });
      unsub();
    };
  }, [chatId]);

  return (
    <section className="flex h-full w-full">
      <div className="w-full flex flex-col gap-4">
        <ChatHeader recipient={recipient} />

        <div className="flex flex-grow items-center justify-center">
          {isPending && <LoadingSpinner msg="fetching messages..." />}

          {!messages.length && !isPending && (
            <ErrorMsg
              className="w-44 sm:w-64 mb-5 self-center justify-self-center"
              img={start_chatting}
              msg="Your conversation is empty."
              subMsg="start chatting below"
            />
          )}
        </div>

        {messages.length !== 0 && (
          <main
            ref={conversationContainer}
            onScroll={chatBoxScrollHandler}
            className="relative flex flex-col overflow-scroll scrollbar-hide px-4"
          >
            {messages.map((currentMsg: Message) => (
              <MessageBox
                key={currentMsg.id}
                currentMsg={currentMsg}
                latestMsgRef={latestMsg}
              />
            ))}
          </main>
        )}

        <div className="w-full flex items-center relative gap-2 p-4 pt-0">
          <AnimatePresence>
            {showArrowDown && (
              <motion.div
                animate={{ opacity: 1, x: -50 }}
                initial={{ opacity: 0, x: -50 }}
                exit={{ opacity: 0, x: -50 }}
                className="absolute -top-3/4 left-1/2 z-10"
              >
                <TwButton onClick={scrollDown} className="rounded-full px-2">
                  <AiOutlineArrowDown className="text-xl text-white " />
                </TwButton>
              </motion.div>
            )}
          </AnimatePresence>

          <ChatForm setMessages={setMessages} />
        </div>
      </div>
    </section>
  );
};

export default ChatBox;
