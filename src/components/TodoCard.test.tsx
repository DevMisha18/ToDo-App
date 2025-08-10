import { TodoCard } from "./TodoCard";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockUpdateTodo = jest.fn();
const mockDeleteTodo = jest.fn();

jest.mock("@/features/todos/todosApi", () => ({
  useUpdateTodoMutation: () => [mockUpdateTodo],
  useDeleteTodoMutation: () => [mockDeleteTodo],
}));

describe("TodoCard", () => {
  const todoCardProps = {
    id: 1,
    name: "Todo Name",
    completed: false,
    created_at: "2025-08-08T10:00:00Z",
    user_id: "9283",
  };

  beforeEach(() => {
    mockUpdateTodo.mockClear();
    mockDeleteTodo.mockClear();
  });

  it("Should tick checkbox and dispatch action", async () => {
    jest.useFakeTimers();

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<TodoCard {...todoCardProps} />);

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    // checkbox is debounced for 300ms
    jest.advanceTimersByTime(500);

    expect(mockUpdateTodo).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it("Should edit todo and dispatch action", async () => {
    const user = userEvent.setup();
    render(<TodoCard {...todoCardProps} />);

    const editButton = screen.getByRole("button", { name: "edit" });
    await user.click(editButton);

    const input = screen.getByRole("textbox");
    await user.type(input, "New Todo");
    await user.keyboard("{Enter}");

    expect(mockUpdateTodo).toHaveBeenCalled();
  });

  it("Should delete todo and dispatch action", async () => {
    const user = userEvent.setup();
    render(<TodoCard {...todoCardProps} />);

    const deleteButton = screen.getByRole("button", { name: "delete" });
    await user.click(deleteButton);

    expect(mockDeleteTodo).toHaveBeenCalled();
  });
});
