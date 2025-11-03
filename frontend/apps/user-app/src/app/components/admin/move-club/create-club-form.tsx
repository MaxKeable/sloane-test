import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Button } from "@repo/ui-kit/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui-kit/components/ui/form";
import { Input } from "@repo/ui-kit/components/ui/input";
import {
  MoveClubCreateRequest,
  moveClubCreateRequestSchema,
  MoveClubUpdateRequest,
  moveClubUpdateRequestSchema,
  MoveClub,
} from "@backend/src/model/types";
import {
  useCreateMoveClub,
  useUpdateMoveClub,
} from "@/api/admin/use-move-club-api";
import { toast } from "react-hot-toast";

interface CreateMoveClubFormProps {
  onSuccess?: () => void;
  moveClub?: MoveClub;
}

export const MoveClubForm = ({
  onSuccess,
  moveClub,
}: CreateMoveClubFormProps) => {
  const form = useForm<MoveClubUpdateRequest | MoveClubCreateRequest>({
    defaultValues: {
      duration: moveClub?.duration ?? 0,
      eventDateTime: moveClub?.eventDateTime ?? new Date(),
      eventTitle: moveClub?.eventTitle ?? "",
      eventLink: moveClub?.eventLink ?? "",
      imageUrl: moveClub?.imageUrl ?? "",
    },
    resolver: standardSchemaResolver(
      moveClub ? moveClubUpdateRequestSchema : moveClubCreateRequestSchema
    ),
  });

  const { mutate: createMoveClub, isPending: isCreating } = useCreateMoveClub();
  const { mutate: updateMoveClub, isPending: isUpdating } = useUpdateMoveClub();

  const onSubmit = (data: MoveClubCreateRequest | MoveClubUpdateRequest) => {
    if (moveClub) {
      updateMoveClub(
        { id: moveClub.id, input: data },
        {
          onSuccess: () => {
            toast.success("Move club updated successfully");
            form.reset();
            onSuccess?.();
          },
          onError: () => {
            toast.error("Failed to update move club");
          },
        }
      );
    } else {
      createMoveClub(data as MoveClubCreateRequest, {
        onSuccess: () => {
          toast.success("Move club created successfully");
          form.reset();
          onSuccess?.();
        },
        onError: () => {
          toast.error("Failed to create move club");
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="eventTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventDateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Date & Time</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  value={
                    field.value
                      ? new Date(field.value).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Link</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="outline" type="submit" className="w-full">
          {isCreating || isUpdating
            ? moveClub
              ? "Updating..."
              : "Creating..."
            : moveClub
              ? "Update Move Club"
              : "Create Move Club"}
        </Button>
      </form>
    </Form>
  );
};
