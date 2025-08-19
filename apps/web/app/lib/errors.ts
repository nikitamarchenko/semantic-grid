export const NonAuthorizedError = new Error("Unauthorized");

export const FreeQuotaExceededError = new Error("Free quota exceeded");

export const ForbiddenError = new Error("Forbidden");

export const fromStatus = ({
  status,
  statusText,
}: {
  status: number;
  statusText?: string;
}) => new Error(`Error ${status}: ${statusText}`);
