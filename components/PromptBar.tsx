import { useHotkeys } from "react-hotkeys-hook";
import { useGmail } from "@/providers/GmailProvider";
import { usePromptContext } from "@/providers/PromptProvider";
import { createFilterFromPrompt } from "@/utils/actions";
import { SparklesIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";

export function PromptBar(props: {}) {
  const { setPrompt, setFunction } = usePromptContext();
  const { labels } = useGmail();

  const inputRef = useRef<HTMLInputElement>(null);
  useHotkeys("meta+k", () => {
    inputRef.current?.focus();
  });

  return (
    <form
      className="relative flex flex-1"
      action={async (formData: FormData) => {
        const promptMessage = formData.get("prompt") as string;

        setPrompt(promptMessage);

        const res = await createFilterFromPrompt({
          message: promptMessage,
          labels: Object.values(labels || {}).map((label) => label.name),
        });

        if (res.filter) {
          setFunction({
            name: res.filter.name || "",
            args: res.filter.arguments ? JSON.parse(res.filter.arguments) : "",
          });
        } else {
          console.log("no filter");
          console.log(JSON.stringify(res, null, 2));
        }
      }}
    >
      <label htmlFor="prompt-field" className="sr-only">
        Prompt
      </label>
      <SparklesIcon
        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
        aria-hidden="true"
      />
      <input
        id="prompt-field"
        className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
        placeholder="Prompt. eg. Label and archive all newsletters"
        type="text"
        name="prompt"
        autoComplete="off"
        ref={inputRef}
      />
    </form>
  );
}