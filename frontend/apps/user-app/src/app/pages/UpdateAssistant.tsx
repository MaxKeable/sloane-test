import { useUser } from "@clerk/clerk-react";
import { useAssistants } from "../../hooks/useAssistants";
import { IAssistant } from "../../types/interfaces";
import Square from "./Dashboard/Square";
import { useNavigate } from "react-router-dom";
import NotAdmin from "./NotAdmin";

const UpdateAssistant = () => {
  const { assistants } = useAssistants();
  const { user } = useUser();
  const navigate = useNavigate();

  const handleClickAssistant = (_id: string) => {
    console.log(_id);
    const proceed = window.confirm("Proceed to update this assistant?");
    if (proceed) {
      navigate(`/updateAssistant/${_id}`);
    }
  };

  if (user?.publicMetadata.account !== "admin") {
    return <NotAdmin />;
  }

  return (
    <div className="w-screen min-h-contain  bg-brand-green flex justify-center items-center flex-col">
      <div className="text-center">
        <h2 className="text-brand-cream text-center text-1xl md:text-5xl lg:text-[92px] xl:text-[102px] pt-2 lg:pt-2">
          Update Ai Assistant
        </h2>
      </div>
      <div className="max-w-[1440px] w-full flex flex-col justify-center h-full px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-4 ">
          <div className="col-span-2 md:col-span-4 lg:col-span-4 pb-8">
            <h5 className="font-Black text-brand-orange-cream text-brand-cream text-[24px] md:text-4xl">
              Hi {user?.firstName},
            </h5>
            <h5 className="font-Black text-brand-cream text-[21px] md:text-4xl">
              Which assistant do you need to change?
            </h5>
          </div>
          {assistants &&
            assistants.map((assistant: IAssistant, index: number) => (
              <div
                key={index}
                onClick={() => handleClickAssistant(assistant._id)}
                className="w-[150px] min-h-[120px] md:w-[150px] lg:w-[200px] md:h-[150px] lg:h-[150px] relative cursor-pointer flex flex-col items-center justify-center"
              >
                <Square title={assistant.jobTitle} _id={assistant._id} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UpdateAssistant;
