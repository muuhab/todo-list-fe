import { AddTodo, DeleteTodo, UpdateTodo } from "@/actions/todoAPis";
import { TodoItemInterface, formSchema, formSchemaType } from "@/components/todo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { isEmpty } from 'lodash';
import toast from "react-hot-toast";


export const useTodoItem = (item: TodoItemInterface, setShowInput?: (value: boolean) => void) => {
    const [focus, setFocus] = useState(false)
    const [open, setOpen] = useState(false)

    const [files, setFiles] = useState([]);

    const onFileChange = (e: any) => setFiles(e.target.files);


    const { mutate: addTodo } = AddTodo()
    const { mutate: deleteTodo } = DeleteTodo()
    const { mutate: updateTodo } = UpdateTodo()


    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: item.title,
            description: item.description || undefined,
            completed: item.completed === 1 ? true : false
        },

    })

    useEffect(() => {
        if (item.open)
            openItem()
    }, [item.open]);


    const onSubmit = async (values: formSchemaType) => {
        try {
            await form.trigger(['title', 'description', 'completed'])
            if (values.description === '') delete values.description

            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append(`attachments[]`, files[0]);
            }
            for (let key in values) {
                formData.append(key, values[key as keyof formSchemaType]!.toString());
            }
            if (item.id) {

                formData.append('id', item.id.toString())
                formData.append('_method', 'PATCH')
                updateTodo(formData)
            }
            else {
                addTodo(formData)
            }
            form.reset(values)
            setFiles([])
            setShowInput &&
                setShowInput(false)
        } catch (error) {
            console.log(error)
        }
    }



    const focusItem = () => {
        if (!open)
            setFocus(true)
    };

    const openItem = () => {
        setOpen(true)
        setFocus(false)
        setTimeout(() => form.setFocus('title'), 10);

    };

    const deFocusItems = () => {
        setFocus(false)
        setOpen(false)
    };

    const removeItem = () => {
        try {
            setTimeout(deFocusItems, 10);
            deleteTodo(item.id as number)

        } catch (error) {
            console.log(error)
        }
    };



    // handle blur event to submit the form
    const handleBlur = (e: React.FocusEvent<HTMLFormElement>) => {
        const currentTarget = e.currentTarget;
        setTimeout(async () => {
            if (!currentTarget.contains(document.activeElement)) {
                setOpen(false)
                setFocus(false)
                await form.trigger()
                for (let key in form.formState.errors) {
                    toast.error(form.formState.errors[key as keyof formSchemaType]?.message!)
                }
                const isFormEdited = form.getFieldState('title').isDirty || form.getFieldState('description').isDirty || form.getFieldState('completed').isDirty
                if (isEmpty(form.formState.errors) && (isFormEdited || files.length > 0)) {
                    form.handleSubmit(onSubmit)()
                }

            }
        }, 0);
    };


    // update completed status without opening the item
    useEffect(() => {
        if (!open && form.getFieldState('completed').isDirty) {
            const formData = new FormData();
            formData.append('completed', form.watch('completed').toString())
            formData.append('id', item.id!.toString())
            formData.append('_method', 'PATCH')
            updateTodo(formData)
        }
    }, [form.watch('completed')])

    return {
        form, focusItem, openItem, handleBlur, removeItem, onFileChange, files, focus,
        open,
    }
}