defmodule LiveViewTodosWeb.TodoLive do
  use Phoenix.LiveView

  alias LiveViewTodos.Todos
  alias LiveViewTodosWeb.TodoView

   @timedelay 500

  def mount(_session, socket) do
    Todos.subscribe()
    Process.send_after(self(), :tick, @timedelay)
    socket = assign(socket, time: DateTime.utc_now)
    {:ok, fetch(socket)}
  end

  def handle_event("add", %{"todo" => todo}, socket) do
    Todos.create_todo(todo)

    {:noreply, fetch(socket)}
  end

  def handle_event("huh", %{"something" => something}, socket) do
    IO.inspect something
    {:noreply, socket}
  end

  def handle_event("destroy", %{"todo"=> id}, socket) do
    Todos.get_todo!(id)
    |> Todos.delete_todo()

    {:noreply, fetch(socket)}
  end

  def handle_event("mounted", _, socket) do
    IO.inspect "clicked button"
    {:noreply, socket}
  end

  def handle_info({Todos, [:todo | _], _}, socket) do
    {:noreply, fetch(socket)}
  end

  def handle_info(:tick, socket) do
    Process.send_after(self(), :tick, @timedelay)
    {:noreply, assign(socket, time: DateTime.utc_now)}
  end

  def render(assigns) do
    TodoView.render("todos.html", assigns)
  end

  defp fetch(socket) do
    assign(socket, todos: Todos.list_todos())
  end

end
