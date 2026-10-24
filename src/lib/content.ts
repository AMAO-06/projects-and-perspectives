export type Profile = {
  name: string;
  title: string;
  location: string;
  email: string;
  tagline: string;
  skills: string[];
  photo?: string;
  heroImage?: string;
};

export const profile: Profile = {
  name: "Alaran Mashkur",
  title: "Mechatronics Engineer",
  location: "Lagos, Nigeria",
  email: "mashkur.m2300593@st.futminna.edu.ng",
  tagline: "I design machines that sense, think and move — blending mechanics, electronics and code.",
  skills: ["Robotics", "Embedded C/C++", "ROS 2", "Control Systems", "SolidWorks", "PCB Design", "Python", "Computer Vision"],
};

export type Project = { title: string; summary: string; tags: string[]; year: string; image?: string; gallery?: string[] };

export const projects: Project[] = [
  { title: "6-DOF Robotic Arm", summary: "Low-cost manipulator with inverse kinematics and a custom servo controller board.", tags: ["ROS 2", "Kinematics", "PCB"], year: "2026" },
  { title: "Line-Following AGV", summary: "Autonomous guided vehicle with PID control for small warehouse logistics.", tags: ["PID", "STM32", "Sensors"], year: "2025" },
  { title: "Smart Irrigation Controller", summary: "Soil-moisture driven IoT system that cut water use in field tests.", tags: ["IoT", "ESP32", "Solar"], year: "2025" },
  { title: "Vision Sorting Conveyor", summary: "Camera-based object sorting using OpenCV and pneumatic actuators.", tags: ["OpenCV", "Pneumatics", "Python"], year: "2024" },
  { title: "Self-Balancing Robot", summary: "Two-wheeled inverted pendulum stabilised with sensor fusion and LQR.", tags: ["LQR", "IMU", "Arduino"], year: "2024" },
  { title: "Prosthetic Hand Prototype", summary: "3D-printed hand driven by EMG signals for grip control.", tags: ["EMG", "3D Printing", "Biomech"], year: "2023" },
];

export type Certification = { title: string; issuer: string; year: string; id?: string };

export const certifications: Certification[] = [
  { title: "Certified SOLIDWORKS Associate (CSWA)", issuer: "Dassault Systèmes", year: "2025" },
  { title: "ROS 2 Developer Certificate", issuer: "The Construct", year: "2025" },
  { title: "Fundamentals of Digital Manufacturing, Design and Sustainability", issuer: "Autodesk · Coursera", year: "2024" },
  { title: "PLC Programming — From Novice to Professional", issuer: "Udemy", year: "2024" },
  { title: "Python for Everybody Specialization", issuer: "University of Michigan · Coursera", year: "2023" },
];

export type Research = { title: string; venue: string; year: string; abstract: string };

export const research: Research[] = [
  { title: "Adaptive PID Tuning for Low-Cost Mobile Robots in Unstructured Terrain", venue: "Final Year Thesis", year: "2026", abstract: "A comparison of fuzzy and gain-scheduled PID approaches for affordable differential-drive robots." },
  { title: "Energy-Efficient Actuation for Solar-Powered Agricultural Robots", venue: "Conference Paper (draft)", year: "2025", abstract: "Analysis of motor selection and duty cycling to extend field operation time." },
  { title: "EMG Signal Classification for Low-Cost Prosthetics", venue: "Research Project", year: "2024", abstract: "Lightweight feature extraction enabling real-time grip classification on microcontrollers." },
];
