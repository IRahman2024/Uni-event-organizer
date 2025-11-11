import { CredentialSignUp } from "@stackframe/stack";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shadcn-components/ui/card"
import { FieldGroup } from "@/shadcn-components/ui/field";
import Hyperspeed from "@/shadcn-components/Hyperspeed";
import BlurText from "@/components/Blur-text/BlurText";

const SignUp = () => {

    const hyperspeedPresets = {
        one: {
            // onSpeedUp: () => { },
            // onSlowDown: () => { },
            distortion: 'turbulentDistortion',
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 3,
            fov: 150,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.03, 400 * 0.2],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.8, 0.8],
            carFloorSeparation: [0, 5],
            colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0x131318,
                brokenLines: 0x131318,
                leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
                rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
                sticks: 0x03b3c3
            }
        },
        two: {
            // onSpeedUp: () => { },
            // onSlowDown: () => { },
            distortion: 'mountainDistortion',
            length: 400,
            roadWidth: 9,
            islandWidth: 2,
            lanesPerRoad: 3,
            fov: 150,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 50,
            lightPairsPerRoadWay: 50,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],

            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.05, 400 * 0.15],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.2, 0.2],
            carFloorSeparation: [0.05, 1],
            colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0x131318,
                brokenLines: 0x131318,
                leftCars: [0xff102a, 0xeb383e, 0xff102a],
                rightCars: [0xdadafa, 0xbebae3, 0x8f97e4],
                sticks: 0xdadafa
            }
        },
        three: {
            // onSpeedUp: () => { },
            // onSlowDown: () => { },
            distortion: 'xyDistortion',
            length: 400,
            roadWidth: 9,
            islandWidth: 2,
            lanesPerRoad: 3,
            fov: 150,
            fovSpeedUp: 150,
            speedUp: 3,
            carLightsFade: 0.4,
            totalSideLightSticks: 50,
            lightPairsPerRoadWay: 30,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.02, 0.05],
            lightStickHeight: [0.3, 0.7],
            movingAwaySpeed: [20, 50],
            movingCloserSpeed: [-150, -230],
            carLightsLength: [400 * 0.05, 400 * 0.2],
            carLightsRadius: [0.03, 0.08],
            carWidthPercentage: [0.1, 0.5],
            carShiftX: [-0.5, 0.5],
            carFloorSeparation: [0, 0.1],
            colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0x131318,
                brokenLines: 0x131318,
                leftCars: [0x7d0d1b, 0xa90519, 0xff102a],
                rightCars: [0xf1eece, 0xe6e2b1, 0xdfd98a],
                sticks: 0xf1eece
            }
        },
        four: {
            // onSpeedUp: () => { },
            // onSlowDown: () => { },
            distortion: 'LongRaceDistortion',
            length: 400,
            roadWidth: 10,
            islandWidth: 5,
            lanesPerRoad: 2,
            fov: 150,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 50,
            lightPairsPerRoadWay: 70,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.05, 400 * 0.15],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.2, 0.2],
            carFloorSeparation: [0.05, 1],
            colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0x131318,
                brokenLines: 0x131318,
                leftCars: [0xff5f73, 0xe74d60, 0xff102a],
                rightCars: [0xa4e3e6, 0x80d1d4, 0x53c2c6],
                sticks: 0xa4e3e6
            }
        },
        five: {
            // onSpeedUp: () => { },
            // onSlowDown: () => { },
            distortion: 'turbulentDistortion',
            length: 400,
            roadWidth: 9,
            islandWidth: 2,
            lanesPerRoad: 3,
            fov: 150,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 50,
            lightPairsPerRoadWay: 50,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.05, 400 * 0.15],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.2, 0.2],
            carFloorSeparation: [0.05, 1],
            colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0x131318,
                brokenLines: 0x131318,
                leftCars: [0xdc5b20, 0xdca320, 0xdc2020],
                rightCars: [0x334bf7, 0xe5e6ed, 0xbfc6f3],
                sticks: 0xc5e8eb
            }
        },
        six: {
            // onSpeedUp: () => { },
            // onSlowDown: () => { },
            distortion: 'deepDistortion',
            length: 400,
            roadWidth: 18,
            islandWidth: 2,
            lanesPerRoad: 3,
            fov: 150,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 50,
            lightPairsPerRoadWay: 50,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.05, 400 * 0.15],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.2, 0.2],
            carFloorSeparation: [0.05, 1],
            colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0x131318,
                brokenLines: 0x131318,
                leftCars: [0xff322f, 0xa33010, 0xa81508],
                rightCars: [0xfdfdf0, 0xf3dea0, 0xe2bb88],
                sticks: 0xfdfdf0
            }
        }
    };

    return (
        <div className="relative min-h-screen bg-black w-full overflow-hidden font-sans">

            {/* <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_80%_90%,_#ffffff_1px,_transparent_1px)] bg-[length:20px_20px] opacity-40" /> */}

            <div className="absolute inset-0 z-[1]">
                <Hyperspeed effectOptions={hyperspeedPresets.two} />
            </div>

            <div className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/20" />

            <div className="relative z-10 flex lg:flex-row flex-col min-h-screen items-center justify-center p-6 md:p-10">
                <BlurText
                    text={`Unlock your full potential`}
                    delay={200}
                    animateBy="letters"
                    direction="top"
                    className="text-4xl mb-8 mr-6 text-white"
                />

                <Card className="bg-transparent text-white shadow-sm font-sans w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Sign Up for New Account</CardTitle>
                        <CardDescription>Enter your credentials below to signup</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <CredentialSignUp></CredentialSignUp>
                        </FieldGroup>
                    </CardContent>
                    <CardFooter className='text-center text-white'>
                        <p>Already Have Account?</p>
                        <a className="text-white hover:text-primary ml-2" href="/SignIn">Sign In</a>
                    </CardFooter>
                </Card>
            </div>

        </div>
    );
};

export default SignUp;