// services/exam.service.js
export const getAvailableExams = async (student) => {
  return Exam.find({
    classId: student.classId,
    isActive: true,
  }).populate("subjectId", "name");
};
