import { createContext, useState } from "react";
import run from "../config/gemini";

// eslint-disable-next-line react-refresh/only-export-components
export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setprevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            // Concatenate the word to the existing result
            setResultData(prev => prev + nextWord);
        }, 75 * index);

    }

    const newChat =() =>{
        setLoading(false)
        setShowResult(false)
    }


    const onSent = async (prompt) => {
        setResultData("")
        setLoading(true)
        setShowResult(true)
        let responce;
        if (prompt !== undefined) {
            responce = await run(prompt);
            setRecentPrompt(prompt)
        }
        else {
            setprevPrompts(prev => [...prev, input])
            setRecentPrompt(input)
            responce = await run(input)
        }

        let responceArray = responce.split("**");
        let newResponce = "";
        for (let i = 0; i < responceArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponce += responceArray[i];

            }
            else {
                newResponce += "<b>" + responceArray[i] + "</b>";
            }
        }

        let newResponce2 = newResponce.split("*").join("<br>");
        let newResponceArray = newResponce2.split(" ");
        for (let i = 0; i < newResponceArray.length; i++) {
            const nextWord = newResponceArray[i];
            delayPara(i, nextWord + " ")
        }

        setLoading(false)
        setInput("")
    }


    const contextValue = {
        prevPrompts,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setprevPrompts,
        onSent,
        setRecentPrompt,
        setInput,
        setLoading,
        setShowResult,
        setResultData,
        newChat

    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider