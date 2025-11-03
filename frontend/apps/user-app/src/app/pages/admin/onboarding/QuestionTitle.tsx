import { Question } from "../../../../types/question";
import { useNavigate } from "react-router-dom";

type Props = {
  question: Question;
  isSelected: boolean;
};

export default function QuestionTitle({ question, isSelected }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`?question=${question._id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left bg-white rounded-md p-4 hover:bg-gray-50 transition-colors text-brand-dark-green shadow-sm ${
        isSelected ? "border-4 border-brand-logo" : ""
      }`}
    >
      {question.title}
    </button>
  );
}
