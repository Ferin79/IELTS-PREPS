import React, { useContext } from "react";
import {
  AiFillHome,
  AiOutlineLogout,
  AiFillLock,
  AiOutlineSchedule,
} from "react-icons/ai";
import { FaUsers, FaTeamspeak } from "react-icons/fa";
import { BsFillPersonLinesFill, BsFillChatFill } from "react-icons/bs";
import { AuthContext } from "../data/auth";
import { Context } from "../data/context";

const SiderbarData = () => {
  const { currentUser } = useContext(AuthContext);
  const { role } = useContext(Context);

  const routes = [];
  if (currentUser) {
    if (role === "admin") {
      routes.push(
        {
          title: "Home",
          path: "/",
          icon: <AiFillHome />,
          cName: "nav-text",
        },
        {
          title: "Manage Staff",
          path: "/staff",
          icon: <FaUsers />,
          cName: "nav-text",
        },
        {
          title: "Manage Students",
          path: "/student",
          icon: <BsFillPersonLinesFill />,
          cName: "nav-text",
        },
        {
          title: "Chat",
          path: "/message",
          icon: <BsFillChatFill />,
          cName: "nav-text",
        },
        {
          title: "Conduct Speaking",
          path: "/speaking",
          icon: <FaTeamspeak />,
          cName: "nav-text",
        },
        {
          title: "Manage Timetable",
          path: "/timetable",
          icon: <AiOutlineSchedule />,
          cName: "nav-text",
        },
        {
          title: "Logout",
          path: "/logout",
          icon: <AiOutlineLogout />,
          cName: "nav-text",
        }
      );
    } else if (role === "staff") {
      routes.push(
        {
          title: "Home",
          path: "/",
          icon: <AiFillHome />,
          cName: "nav-text",
        },
        {
          title: "Manage Students",
          path: "/student",
          icon: <BsFillPersonLinesFill />,
          cName: "nav-text",
        },
        {
          title: "Chat",
          path: "/message",
          icon: <BsFillChatFill />,
          cName: "nav-text",
        },
        {
          title: "Conduct Speaking",
          path: "/speaking",
          icon: <FaTeamspeak />,
          cName: "nav-text",
        },
        {
          title: "View Timetable",
          path: "/staff/timetable",
          icon: <AiOutlineSchedule />,
          cName: "nav-text",
        },
        {
          title: "Logout",
          path: "/logout",
          icon: <AiOutlineLogout />,
          cName: "nav-text",
        }
      );
    } else if (role === "student") {
      routes.push(
        {
          title: "Home",
          path: "/",
          icon: <AiFillHome />,
          cName: "nav-text",
        },
        {
          title: "Chat",
          path: "/message",
          icon: <BsFillChatFill />,
          cName: "nav-text",
        },
        {
          title: "Speaking",
          path: "/student/speaking",
          icon: <FaTeamspeak />,
          cName: "nav-text",
        },
        {
          title: "Logout",
          path: "/logout",
          icon: <AiOutlineLogout />,
          cName: "nav-text",
        }
      );
    }
  } else {
    routes.push({
      title: "Login",
      path: "/login",
      icon: <AiFillLock />,
      cName: "nav-text",
    });
  }
  return routes;
};
export default SiderbarData;
