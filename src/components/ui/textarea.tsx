export function Textarea({ id, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
      <textarea
        id={id}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    );
  }
  