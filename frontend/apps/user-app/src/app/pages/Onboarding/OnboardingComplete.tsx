import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnswerService } from "../../../services/answerService";
import { toast } from "react-hot-toast";

export default function OnboardingComplete() {
  const [params] = useSearchParams();
  const questionId = params.get("question");
  const navigate = useNavigate();

  const { mutate: completeOnboarding, isPending: isCompletingOnboarding } =
    useMutation({
      mutationFn: AnswerService.completeOnboarding,
      onSuccess: () => {
        navigate("/dashboard");
      },
      onError: (error) => {
        console.error("Onboarding completion error:", error);
        toast.error(
          "There was an issue completing your onboarding. We'll redirect you to the dashboard.",
          {
            position: "top-center",
            duration: 5000,
          }
        );
        // Navigate to dashboard anyway if the backend fails
        navigate("/dashboard");
      },
    });

  if (questionId !== "complete") {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-6 px-4">
      <div className="flex flex-col items-center justify-center">
        <div className="w-[300px] h-[200px] md:w-[500px] md:h-[350px] lg:w-[700px] lg:h-[500px] mb-8">
          <iframe
            src="https://player.vimeo.com/video/1070723336?h=share"
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
            title="Onboarding completion video"
          />
        </div>
        <button
          onClick={() => completeOnboarding({})}
          disabled={isCompletingOnboarding}
          className="px-6 py-2 rounded-lg bg-brand-cream/80 text-[#4b8052] font-medium
            transition-all duration-200
            hover:bg-brand-cream hover:shadow-lg hover:-translate-y-[1px]
            active:translate-y-0 active:shadow-md
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCompletingOnboarding
            ? "Starting..."
            : "Start chatting with Sloane"}
        </button>
      </div>
    </div>
  );
}
