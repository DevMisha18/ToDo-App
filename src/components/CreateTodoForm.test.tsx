import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateTodoForm } from "./CreateTodoForm";

const mockCreateTodo = jest.fn();

jest.mock("@/features/todos/todosApi", () => ({
  useCreateTodoMutation: () => [mockCreateTodo],
}));

describe("CreateTodoForm", () => {
  beforeEach(() => {
    mockCreateTodo.mockClear();
  });

  it("Form closes correctly & sends call with correct values", async () => {
    const setShowCreateTodoForm = jest.fn();
    render(<CreateTodoForm setShowCreateTodoForm={setShowCreateTodoForm} />);

    const input = screen.getByRole("textbox");
    const todoName = "My Todo";
    await userEvent.type(input, todoName);

    const submitButton = screen.getByRole("button");
    await userEvent.click(submitButton);

    expect(setShowCreateTodoForm).toHaveBeenCalledWith(false);
    expect(mockCreateTodo).toHaveBeenCalledWith({
      todo: { name: todoName, completed: false },
    });
  });

  it("Form doesn't let submit on empty input", async () => {
    const setShowCreateTodoForm = jest.fn();
    render(<CreateTodoForm setShowCreateTodoForm={setShowCreateTodoForm} />);

    const submitButton = screen.getByRole("button");
    await userEvent.click(submitButton);

    expect(setShowCreateTodoForm).toHaveBeenCalledTimes(0);
  });

  it("Form doesn't let submit on input consisting of spaces", async () => {
    const setShowCreateTodoForm = jest.fn();
    render(<CreateTodoForm setShowCreateTodoForm={setShowCreateTodoForm} />);

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "    ");

    const submitButton = screen.getByRole("button");
    await userEvent.click(submitButton);

    expect(setShowCreateTodoForm).toHaveBeenCalledTimes(0);
  });
});
