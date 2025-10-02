import React, { useTransition } from 'react'
import z from 'zod'
import { UserDetailsSchema } from '@/lib/schema/zod'
import { Button } from './ui/button'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input'
import { AlertCircleIcon, Loader2 } from 'lucide-react'

export default function Editdetails({
    values,
    updateCandidate,
    openModal,
    setOpenModal
}: {
    values: {
        name: string,
        email: string,
        phone: string
    },
    updateCandidate: (values: z.infer<typeof UserDetailsSchema>) => void,
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}) {

    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof UserDetailsSchema>>({
        resolver: zodResolver(UserDetailsSchema),
        defaultValues: {
            ...values
        }
    });

    const onSubmit = (values: z.infer<typeof UserDetailsSchema>) => {
        startTransition(() => {
            updateCandidate(values)
            setOpenModal(false)
        });
    }
    return <AlertDialog open={openModal}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertDescription>The details extracted are not proper, please check them and make the changes.</AlertDescription>
                </Alert>
                <AlertDialogTitle>Edit Details</AlertDialogTitle>
            </AlertDialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder='Steve Rogers'
                                            type="text"
                                            autoComplete="name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <div className='w-full bg-red h-full relative'>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder='(e.g. steverogers11545@gmail.com)'
                                                type={"email"}
                                                autoComplete="email"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='phone'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <div className='w-full bg-red h-full relative'>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                type={"text"}
                                                placeholder="(e.g. +91 98765 43210)"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <AlertDialogFooter>
                        <Button type="submit" disabled={isPending} className='w-full'>
                            {isPending && (
                                <>
                                    <Loader2 className='animate-spin mr-2' size={18} />
                                    <span>Submitting</span>
                                </>
                            )}
                            {!isPending && <span>Continue</span>}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </Form>
        </AlertDialogContent>
    </AlertDialog>
}
