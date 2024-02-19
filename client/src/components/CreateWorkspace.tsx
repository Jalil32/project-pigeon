import LoginInput from './LoginInput'
import LoginButton from './LoginButton'

function CreateWorkspace() {
    function handleSubmit() {
        // submit form
        // wait for completion
        // redirect to new workspace
    }

    return (
        <div className="w-[500px] h-[500px] bg-stone-800 rounded-2xl shadow-2xl p-8">
            <div className=" md:space-y-8 lg:space-y-8 space-y-4 lg:text-[35px] md:text-[30px] sm:text-[30px] text-stone-400 font-noto font-bold">
                <div className="flex flex-row justify-between">
                    <div>Create workspace</div>
                    <button className="hover:text-sky-400">x</button>
                </div>

                <form className="md:space-y-8 lg:space-y-8 space-y-4 text-[20px]">
                    <LoginInput name="name" label="Workspace Name" />
                    <LoginButton type="submit" buttonText="Create Workspace" />
                </form>
            </div>
        </div>
    )
}

export default CreateWorkspace
