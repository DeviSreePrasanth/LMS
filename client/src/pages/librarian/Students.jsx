import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const studentsPerPage = 20;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsResponse = await axios.get(
          "https://lmsbackend-six.vercel.app/api/students"
        );
        const studentsData = studentsResponse.data;

        const studentsWithLoans = await Promise.all(
          studentsData.map(async (student) => {
            const loansResponse = await axios.get(
              `https://lmsbackend-six.vercel.app/api/loans?studentId=${student._id}`
            );
            return { ...student, borrowedBooks: loansResponse.data };
          })
        );

        setStudents(studentsWithLoans);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch students");
      }
    };

    fetchStudents();
  }, []);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(students.length / studentsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
  };

  const handleCloseDetails = () => {
    setSelectedStudent(null);
  };

  const calculateFine = (dueDate, returnDate) => {
    // If the book is returned, fine calculation stops at returnDate
    if (returnDate) {
      const due = new Date(dueDate);
      const returned = new Date(returnDate);
      const overdueDays = Math.max(
        0,
        Math.floor((returned - due) / (1000 * 60 * 60 * 24))
      );
      const finePerDay = 5; // $5 per day overdue
      return overdueDays > 0 ? overdueDays * finePerDay : 0;
    }
    // If not returned, calculate fine up to today
    const today = new Date();
    const due = new Date(dueDate);
    const overdueDays = Math.max(
      0,
      Math.floor((today - due) / (1000 * 60 * 60 * 24))
    );
    const finePerDay = 5; // $5 per day overdue
    return overdueDays > 0 ? overdueDays * finePerDay : 0;
  };

  const palette = {
    primary: "#2c3e50",
    accent: "#1abc9c",
    muted: "#7f8c8d",
    bg: "#f4f7fa",
    headerBg: "#1f2937",
  };

  return (
    <motion.div
      className="p-4 sm:p-6 bg-[#f4f7fa] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-[#2c3e50]">
        Student List
      </h2>
      {error && (
        <p className="text-red-500 text-center mb-4 text-sm sm:text-base">
          Error: {error}
        </p>
      )}
      {!students.length ? (
        <p className="text-center text-[#7f8c8d] text-sm sm:text-base">
          Loading...
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-white shadow-md rounded-lg">
              <thead className="bg-[#1f2937] text-white">
                <tr>
                  <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">
                    Student ID
                  </th>
                  <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">
                    Name
                  </th>
                  <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">
                    Email
                  </th>
                  <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student) => (
                  <motion.tr
                    key={student._id}
                    className="hover:bg-gray-100 border-b border-gray-200 transition duration-300 ease-in-out"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: currentStudents.indexOf(student) * 0.1,
                    }}
                  >
                    <td className="py-2 px-3 sm:px-4 text-[#2c3e50] text-xs sm:text-sm">
                      {student.studentId}
                    </td>
                    <td className="py-2 px-3 sm:px-4 text-[#2c3e50] text-xs sm:text-sm">
                      {student.name}
                    </td>
                    <td className="py-2 px-3 sm:px-4 text-[#2c3e50] text-xs sm:text-sm">
                      {student.email}
                    </td>
                    <td className="py-2 px-3 sm:px-4">
                      <motion.button
                        onClick={() => handleViewDetails(student)}
                        className="px-2 sm:px-3 py-1 bg-[#059669] text-white rounded-md hover:bg-[#047857] transition duration-200 text-xs sm:text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Details
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 space-x-2 sm:space-x-4">
            <motion.button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-white transition duration-200 text-xs sm:text-sm ${
                currentPage === 1
                  ? "bg-[#6b7280] cursor-not-allowed"
                  : "bg-[#059669] hover:bg-[#047857]"
              }`}
              whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
            >
              Previous
            </motion.button>
            <span className="text-[#2c3e50] self-center text-xs sm:text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <motion.button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-white transition duration-200 text-xs sm:text-sm ${
                currentPage === totalPages
                  ? "bg-[#6b7280] cursor-not-allowed"
                  : "bg-[#059669] hover:bg-[#047857]"
              }`}
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            >
              Next
            </motion.button>
          </div>

          {/* Student Details Modal */}
          {selectedStudent && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-2xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <h3 className="text-xl sm:text-2xl font-bold text-[#2c3e50] mb-4">
                  Student Details
                </h3>
                <div className="mb-4 text-sm sm:text-base">
                  <p>
                    <strong>Name:</strong> {selectedStudent.name}
                  </p>
                  <p>
                    <strong>Student ID:</strong> {selectedStudent.studentId}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedStudent.email}
                  </p>
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-[#2c3e50] mb-2">
                  Borrowed Books
                </h4>
                {selectedStudent.borrowedBooks.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse bg-gray-50 rounded-lg">
                      <thead className="bg-[#1f2937] text-white">
                        <tr>
                          <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">
                            Book ID
                          </th>
                          <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">
                            Title
                          </th>
                          <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">
                            Issued
                          </th>
                          <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">
                            Due
                          </th>
                          <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">
                            Status
                          </th>
                          <th className="py-2 px-3 sm:px-4 text-left text-xs sm:text-sm">
                            Fine
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStudent.borrowedBooks.map((book) => {
                          const fine = calculateFine(
                            book.dueDate,
                            book.returnDate
                          );
                          const isOverdue =
                            !book.returnDate &&
                            new Date(book.dueDate) < new Date();
                          return (
                            <tr
                              key={book._id}
                              className="border-b border-gray-200"
                            >
                              <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                                {book.bid}
                              </td>
                              <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                                {book.title}
                              </td>
                              <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                                {new Date(book.issueDate).toLocaleDateString()}
                              </td>
                              <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                                {new Date(book.dueDate).toLocaleDateString()}
                              </td>
                              <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                                {book.returnDate ? (
                                  fine > 0 ? (
                                    <span className="text-green-600">
                                      Returned with Fine Paid
                                    </span>
                                  ) : (
                                    <span className="text-green-500">
                                      Returned
                                    </span>
                                  )
                                ) : isOverdue ? (
                                  <span className="text-red-500">Overdue</span>
                                ) : (
                                  <span className="text-[#1abc9c]">Active</span>
                                )}
                              </td>
                              <td className="py-2 px-3 sm:px-4 text-xs sm:text-sm">
                                {book.returnDate
                                  ? fine > 0
                                    ? `$${fine} (Paid)`
                                    : "-"
                                  : fine > 0
                                  ? `$${fine}`
                                  : "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-[#7f8c8d] text-sm sm:text-base">
                    No books borrowed
                  </p>
                )}
                <motion.button
                  onClick={handleCloseDetails}
                  className="mt-4 px-3 sm:px-4 py-1 sm:py-2 bg-[#059669] text-white rounded-md hover:bg-[#047857] transition duration-200 text-xs sm:text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Students;
