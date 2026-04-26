declare module "react-hook-form" {
  export type FieldValues = Record<string, any>;
  export type FieldPath<TFieldValues extends FieldValues = FieldValues> = string;
  export type ControllerProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TTransformedValues = TFieldValues,
  > = {
    render?: (props: {
      field: any;
      fieldState: any;
      formState: any;
    }) => any;
  } & Record<string, any>;
  export type FormProviderProps<
    TFieldValues extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues = TFieldValues,
  > = any;

  export type UseFormReturn<
    TFieldValues extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues = TFieldValues,
  > = {
    register: (name: any, options?: any) => any;
    handleSubmit: (onValid: any, onInvalid?: any) => (event?: any) => any;
    watch: (name?: any) => any;
    setValue: (name: any, value: any, options?: any) => void;
    getValues: (name?: any) => any;
    setError: (name: any, error: any) => void;
    reset: (values?: Partial<TFieldValues>) => void;
    control: any;
    formState: {
      errors: any;
      isValid: boolean;
      isSubmitting: boolean;
      isSubmitted: boolean;
      dirtyFields: Record<string, boolean>;
    };
  } & Record<string, any>;

  export function useForm<
    TFieldValues extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues = TFieldValues,
  >(props?: any): UseFormReturn<TFieldValues, TContext, TTransformedValues>;

  export function useFormContext<
    TFieldValues extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues = TFieldValues,
  >(): UseFormReturn<TFieldValues, TContext, TTransformedValues>;

  export function useFormState(props?: any): any;

  export const FormProvider: <
    TFieldValues extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues = TFieldValues,
  >(
    props: FormProviderProps<TFieldValues, TContext, TTransformedValues>,
  ) => any;

  export const Controller: <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
    TTransformedValues = TFieldValues,
  >(
    props: ControllerProps<TFieldValues, TName, TTransformedValues>,
  ) => any;
}
