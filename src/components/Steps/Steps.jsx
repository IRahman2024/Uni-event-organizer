import { StepsForOrgs } from "./StepsForOrgs";
import { StepsForStudents } from "./StepsForStudents";

const Steps = () => {
    return (
        <div className="pt-10">
            <p className="text-6xl font-bold text-center">Want To Join The Buzz?</p>
            <div>
                <StepsForStudents></StepsForStudents>
            </div>
            <div>
                <StepsForOrgs></StepsForOrgs>
            </div>
        </div>
    );
};

export default Steps;