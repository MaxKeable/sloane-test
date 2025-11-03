import { AdminHeader } from "@/app/components/admin/admin-header";
import {
  useGetFeatureFlags,
  useSeedFeatureFlags,
  useUpdateFeatureFlag,
} from "@/api/admin/use-feature-flag-api";
import { Checkbox } from "@repo/ui-kit/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui-kit/components/ui/card";
import { Button } from "@repo/ui-kit/components/ui/button";
import { Spinner } from "@repo/ui-kit/components/ui/spinner";
import LoadingSpinner from "../../Dashboard/LoadingSpinner";

const FeatureFlagsPage = () => {
  const { data: featureFlags, isLoading } = useGetFeatureFlags();
  const { mutate: updateFeatureFlag, isPending: isUpdatingFeatureFlag } =
    useUpdateFeatureFlag();
  const { mutate: seedFeatureFlags, isPending: isSeedingFeatureFlags } =
    useSeedFeatureFlags();

  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="w-full  bg-brand-green flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-7xl">
        <AdminHeader
          title="Feature Flags"
          description="Manage and view all feature flags"
        />
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Update Feature Flags</CardTitle>
            <Button
              onClick={() => seedFeatureFlags()}
              disabled={isSeedingFeatureFlags || featureFlags?.length !== 0}
            >
              Seed Feature Flags
              {isSeedingFeatureFlags && <Spinner />}
            </Button>
          </CardHeader>
          <CardContent>
            {featureFlags?.map((featureFlag) => (
              <div key={featureFlag.name} className="flex items-center gap-2">
                {isUpdatingFeatureFlag ? (
                  <Spinner />
                ) : (
                  <Checkbox
                    checked={featureFlag.isEnabled}
                    onCheckedChange={(checked) =>
                      updateFeatureFlag({
                        name: featureFlag.name,
                        isEnabled: checked as boolean,
                      })
                    }
                  />
                )}
                <h3 className="text-lg font-bold">{featureFlag.name}</h3>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeatureFlagsPage;
