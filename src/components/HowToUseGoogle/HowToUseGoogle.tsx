import { forwardRef, useEffect, useRef, useState, type PropsWithChildren, type RefObject } from "react";
import styles from "./HowToUseGoogle.module.css";

import googleLogo from "../../img/google.png";
import cursorImage from "../../img/cursor.png";
import Image from "astro/components/Image.astro";

function delay(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

const Button = forwardRef(function Button(
    props: PropsWithChildren & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    ref: any,
) {
    return (
        <div ref={ref} {...props} className={styles.button}>
            {props.children}
        </div>
    );
});

export default function HowToUseGoogle() {
    const query = new URLSearchParams(window.location.search).get("query");
    const [stepDescription, setStepDescription] = useState("1. Wpisz frazę w pole wyszukiwania");
    const [entered, setEntered] = useState("");
    const [cursorPos, setCursorPos] = useState<null | { x: number; y: number }>(null);
    const [cursorActive, setCursorActive] = useState(false);

    const searchBarRef = useRef<HTMLDivElement>(null);
    const searchButtonRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    async function step1() {
        await delay(1000);

        for await (const letter of query!) {
            setEntered((entered) => entered + letter);
            inputRef.current!.scrollLeft = inputRef.current!.scrollWidth;
            await delay(Math.random() * 100 + 30);
        }

        await delay(250);
        step2();
    }

    async function step2() {
        setStepDescription('2. Wciśnij "Szukaj w Google"');

        setCursorPos({
            x: searchBarRef.current!.offsetLeft + 80,
            y: searchBarRef.current!.offsetTop + 15,
        });

        let frames = 0;

        function frame() {
            setCursorPos((currentPos) => ({
                x: currentPos!.x + (searchButtonRef.current!.offsetLeft + 30 - currentPos!.x) / 10,
                y: currentPos!.y + (searchButtonRef.current!.offsetTop + 15 - currentPos!.y) / 10,
            }));
            setCursorActive(true);

            frames++;

            if (frames < 60) setTimeout(frame, 1000 / 60);
            else step3();
        }

        frame();
    }

    async function step3() {
        setStepDescription("Takie trudne?");

        await delay(2000);

        const googleUrl = new URL("https://google.com/search");
        googleUrl.searchParams.set("q", query!);
        window.location.href = googleUrl.toString();
    }

    useEffect(() => {
        if (query !== null) step1();
    }, []);

    return (
        <>
            <div className="w-full h-dvh flex justify-center items-center">
                <div className="flex flex-col items-center">
                    <div className="mb-5 text-xl text-zinc-800">{stepDescription}</div>
                    <img alt="Google" src={googleLogo.src} />
                    <div ref={searchBarRef} className={styles.searchbar}>
                        <div className="flex items-center flex-1">
                            <div className="w-[20px] h-[20px] l text-[#9aa0a6] fill-current">
                                <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                                </svg>
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                readOnly
                                className="ml-2 overflow-x-scroll flex-1 border-none bg-none outline-none"
                                value={entered.replaceAll("\n", "")}
                            />
                        </div>

                        <div></div>
                    </div>
                    <div className="mt-4 flex gap-1">
                        <Button ref={searchButtonRef}>Szukaj w Google</Button>
                        <Button>Szczęśliwy traf</Button>
                    </div>
                </div>
            </div>
            <div
                style={{
                    position: "absolute",
                    left: `${cursorPos?.x}px`,
                    top: `${cursorPos?.y}px`,
                    display: cursorActive ? "block" : "none",
                }}
            >
                <img loading="eager" className="w-[30px] h-[30px]" alt="Mouse cursor" src={cursorImage.src} />
            </div>
        </>
    );
}
