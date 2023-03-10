FormikAutoSave = ({ debounceMS = 1000, onError }: Props) => {
  const formik = useFormikContext();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSubmit = useCallback(
    debounce(() => {
      return formik
        .submitForm()
        .then(() => {})
        .catch(onError);
    }, debounceMS),
    [formik.submitForm, debounceMS]
  );

  useEffect(() => {
    if (formik.dirty) {
      debouncedSubmit();
    }
  }, [debouncedSubmit, formik.values, formik.dirty]);
  return null;
};
