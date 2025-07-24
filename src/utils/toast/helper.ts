import { toast, type Id, type TypeOptions } from "react-toastify";

export const updateToast = (
  toastId: Id,
  type: TypeOptions,
  message: string
) => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    closeOnClick: true,
    autoClose: 2000,
  });
};
