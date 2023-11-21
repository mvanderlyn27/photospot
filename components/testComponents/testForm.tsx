'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export default function ContactForm() {

  const formSchema = z.object({
    firstName: z.string().min(1, 'First name is required').trim(),
    lastName: z.string().min(1, 'Last name is required').trim(),
    file: z
      .any()
      .refine((file) => file?.length == 1, 'File is required.')
      .refine((file) => file[0]?.size <= 3000000, `Max file size is 3MB.`),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      firstName: '',
      lastName: '',
      file: undefined,
    },
    mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register('file', { required: true });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    //still doesn't actually get file properly, need to figure this out..
    alert('Completed successfully '+ JSON.stringify(values.file));
    console.log('file', values.file);
  };
  return (
    <div className="p-5 bg-blue-300 rounded-md w-full lg:w-[30rem]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                  <Input
                    placeholder="First Name"
                    {...field}
                    autoComplete="on"
                    autoCapitalize="on"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last Name"
                    {...field}
                    autoComplete="on"
                    autoCapitalize="on"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                  <Input type="file" {...fileRef} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-4 w-full bg-primary hover:ring-2 ring-primary hover:bg-transparent" type="submit" > Submit </Button>
        </form>
      </Form>
    </div>
  )
}

