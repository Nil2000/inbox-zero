"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { saveAboutAction, type SaveAboutBody } from "@/utils/actions";
import { toastError, toastSuccess } from "@/components/Toast";
import {
  FormSection,
  FormSectionLeft,
  FormSectionRight,
} from "@/components/Form";

export const AboutSectionForm = async (props: { about?: string }) => {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useForm<SaveAboutBody>({
    defaultValues: {
      about:
        props.about ||
        `I am the CEO of a company called CoolRobotsAI. We help companies build robots.

Some rules to follow:
* Be friendly, concise, and professional, but not overly formal.
* Draft responses of 1-3 sentences when necessary.
* Add the newsletter label to emails that are newsletters.
* Draft responses to snoozed emails that I haven't received a response to yet.`,
    },
  });

  return (
    <form
      action={async (formData: FormData) => {
        try {
          const about = formData.get("about") as string;
          await saveAboutAction({ about });
          toastSuccess({ description: "Updated!" });
        } catch (error) {
          console.error(error);
          toastError({
            description: "There was an error updating your profile.",
          });
        }
      }}
    >
      <FormSection>
        <FormSectionLeft
          title="Prompt Settings"
          description="Provide extra information to GPT to help it write better emails for you."
        />
        <div className="md:col-span-2">
          <FormSectionRight>
            <div className="sm:col-span-full">
              <Input
                type="text"
                as="textarea"
                rows={8}
                name="about"
                label="About you"
                registerProps={register("about", { required: true })}
                error={errors.about}
              />
            </div>
          </FormSectionRight>
          <div className="mt-8 flex">
            <Button
              type="submit"
              size="sm"
              color="black"
              loading={isSubmitting}
            >
              Save
            </Button>
          </div>
        </div>
      </FormSection>
    </form>
  );
};