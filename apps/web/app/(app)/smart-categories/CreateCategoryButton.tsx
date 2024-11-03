"use client";

import { useCallback } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useModal } from "@/components/Modal";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/Input";
import { toastSuccess, toastError } from "@/components/Toast";
import {
  createCategoryBody,
  type CreateCategoryBody,
} from "@/utils/actions/validation";
import { isActionError } from "@/utils/error";
import { createCategoryAction } from "@/utils/actions/categorize";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Category } from "@prisma/client";

type ExampleCategory = {
  name: string;
  description: string;
};

const EXAMPLE_CATEGORIES: ExampleCategory[] = [
  {
    name: "Team",
    description:
      "Internal team members with @company.com email addresses, including employees and colleagues within our organization",
  },
  {
    name: "Customer",
    description:
      "Email addresses belonging to customers, including those reaching out for support or engaging with customer success",
  },
  {
    name: "Candidate",
    description:
      "Job applicants, potential hires, and candidates in your interview pipeline",
  },
  {
    name: "Job Application",
    description:
      "Companies, hiring platforms, and recruiters you've applied to or are interviewing with for positions",
  },
  {
    name: "Investor",
    description:
      "Current and potential investors, investment firms, and venture capital contacts",
  },
  {
    name: "Founder",
    description:
      "Startup founders, entrepreneurs, and potential portfolio companies seeking investment or partnerships",
  },
  {
    name: "Vendor",
    description:
      "Service providers, suppliers, and business partners who provide products or services to your company",
  },
  {
    name: "Server Error",
    description: "Automated monitoring services and error reporting systems",
  },
  {
    name: "Press",
    description:
      "Journalists, media outlets, PR agencies, and industry publications seeking interviews or coverage",
  },
  {
    name: "Conference",
    description:
      "Event organizers, conference coordinators, and speaking opportunity contacts for industry events",
  },
  {
    name: "Nonprofit",
    description:
      "Charitable organizations, NGOs, social impact organizations, and philanthropic foundations",
  },
];

export function CreateCategoryButton({
  buttonProps,
}: {
  buttonProps?: ButtonProps;
}) {
  const { isModalOpen, openModal, closeModal, setIsModalOpen } = useModal();

  return (
    <div>
      <Button onClick={openModal} {...buttonProps}>
        {buttonProps?.children ?? (
          <>
            <PlusIcon className="mr-2 size-4" />
            Create category
          </>
        )}
      </Button>

      <CreateCategoryDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        closeModal={closeModal}
      />
    </div>
  );
}

export function CreateCategoryDialog({
  category,
  isOpen,
  onOpenChange,
  closeModal,
}: {
  category?: Pick<Category, "name" | "description">;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  closeModal: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>

        <CreateCategoryForm category={category} closeModal={closeModal} />
      </DialogContent>
    </Dialog>
  );
}

function CreateCategoryForm({
  category,
  closeModal,
}: {
  category?: Pick<Category, "name" | "description"> & { id?: string };
  closeModal: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateCategoryBody>({
    resolver: zodResolver(createCategoryBody),
    defaultValues: {
      id: category?.id,
      name: category?.name,
      description: category?.description,
    },
  });

  const handleExampleClick = useCallback(
    (category: ExampleCategory) => {
      setValue("name", category.name);
      setValue("description", category.description);
    },
    [setValue],
  );

  const onSubmit: SubmitHandler<CreateCategoryBody> = useCallback(
    async (data) => {
      const result = await createCategoryAction(data);

      if (isActionError(result)) {
        toastError({
          description: `There was an error creating the category. ${result.error}`,
        });
      } else {
        toastSuccess({ description: "Category created!" });
        closeModal();
      }
    },
    [closeModal],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="text"
        name="name"
        label="Name"
        registerProps={register("name", { required: true })}
        error={errors.name}
      />
      <Input
        type="text"
        as="textarea"
        rows={2}
        name="description"
        label="Description (Optional)"
        explainText="Additional information used by the AI to categorize senders"
        registerProps={register("description")}
        error={errors.description}
      />

      <div className="rounded border border-gray-200 bg-gray-50 p-3">
        <div className="text-xs font-medium">Examples</div>
        <div className="mt-1 flex flex-wrap gap-2">
          {EXAMPLE_CATEGORIES.map((category) => (
            <Button
              key={category.name}
              type="button"
              variant="outline"
              size="xs"
              onClick={() => handleExampleClick(category)}
            >
              <PlusIcon className="mr-1 size-2" />
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      <Button type="submit" loading={isSubmitting}>
        {category ? "Update" : "Create"}
      </Button>
    </form>
  );
}