export default function ClientMessage({ message }: { message: string }) {
  return (
    <div className="pt-14 w-full flex justify-center items-center">
      <p className=" text-lg">{message}</p>
    </div>
  );
}
