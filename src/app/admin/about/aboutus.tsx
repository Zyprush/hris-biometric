"use client";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Vina Atienza",
      role: "Lead Developer",
      image: "/img/vina.jpg",
    },
    {
      name: "Mark Noland Insigne",
      role: "UI/UX Designer",
      image: "/img/mark.jpg",
    },
    {
      name: "Lance Edward Quiñones",
      role: "Backend Developer",
      image: "/img/lance.jpg",
    },
    {
      name: "King Philip Peralta",
      role: "QA Engineer",
      image: "/img/king.jpg",
    },
    {
      name: "Joy Ambrosio",
      role: "System Architect",
      image: "/img/jhoi.jpg",
    },
  ];

  return (
    <div className="container mx-auto px-6 space-y-12 pt-0">
      {/* Hero Section */}
      <br />
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Our Web-Based Human Resource Management and Payroll System with
          Biometric Technology is built to simplify HR tasks and payroll
          processing for department and commercial stores. This system meets the
          need for easy and accurate employee management by offering a single
          platform that combines staff allocation, attendance monitoring, and
          payroll processing.
        </p>
      </div>
      <div className="text-center space-y-4">
        <a
          href="https://scribehow.com/shared/How_To_Manage_Employee_Accounts_In_Smart_HRIS__wtjcvxeyTi-dhshW7TpXAg"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          User Guide
        </a>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission</h2>
          <p className="text-gray-600">
            Our mission is to simplify human resource management, reduce payroll
            discrepancies, and enhance the accuracy of employee attendance
            through reliable and accessible technology.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vision</h2>
          <p className="text-gray-600">
            We envision a system that empowers businesses to improve
            productivity and operational efficiency by offering secure and
            easy-to-use HR tools that adapt to modern business needs.
          </p>
        </div>
      </div>

      {/* Development Team */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Development Team
        </h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto">
          Our development team is composed of dedicated individuals with
          expertise in technology and software development, committed to
          creating a user-centered, reliable HR system. This project is a
          collaborative effort, incorporating insights and guidance from
          academic mentors to ensure high-quality standards.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="relative overflow-hidden rounded-lg shadow-md">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-gray-900">{member.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 rounded-lg p-8 text-center shadow-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <a
              href="mailto:hrisbiometric@gmail.com"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              hrisbiometric@gmail.com
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              +63 93 8587 1156
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
