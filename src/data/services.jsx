// src/data/services.jsx
import React from 'react';
import {
  FaRobot, FaGlobe, FaGamepad,
  FaBrain, FaServer, FaPalette
} from 'react-icons/fa';

const services = [
  {
    id: 'discord-bot',
    icon: <FaRobot size={28} className="text-blue-500" />,
    title: "Discord Bot Development",
    price: 499,
    description: "Custom Discord bots with commands, games, economy, moderation, and more.",
  },
  {
    id: 'website-dev',
    icon: <FaGlobe size={28} className="text-green-500" />,
    title: "Website Creation",
    price: 999,
    description: "Modern, responsive websites with React, Firebase, Tailwind & full mobile support.",
  },
  {
    id: 'minecraft-server',
    icon: <FaGamepad size={28} className="text-yellow-500" />,
    title: "Minecraft Server Setup",
    price: 799,
    description: "Complete server setup including BedWars, plugins, survival configs and maps.",
  },
  {
    id: 'ai-tools',
    icon: <FaBrain size={28} className="text-purple-500" />,
    title: "Custom AI Tools",
    price: 1199,
    description: "AI caption generators, chatbots, auto-response tools, and API integrations.",
  },
  {
    id: 'game-hosting',
    icon: <FaServer size={28} className="text-indigo-500" />,
    title: "Game Hosting Support",
    price: 299,
    description: "Support for hosting servers like Minecraft, FiveM, Rust & optimization help.",
  },
  {
    id: 'uiux',
    icon: <FaPalette size={28} className="text-pink-500" />,
    title: "UI/UX Design",
    price: 599,
    description: "Modern, clean UI designs for websites and apps using Figma or direct code.",
  },
];

export default services;
