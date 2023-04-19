/** @jsx jsx */
import { Styles } from 'core/types';

import { CustomTableContext, TableColumnsType } from './custom-table-context';

type PropsTypes<TColumnName extends string> = {
  children: React.ReactNode[] | React.ReactNode;
  visibilityMap?: Record<string, boolean>;
  stickyColumns?: Record<string, boolean>;
  isLoading?: boolean;
  isGlobalScroll?: boolean;
  styles?: Styles;
  columns: ReadonlyArray<TableColumnsType<TColumnName>>;
};

export default function DataValidatorContainer<TColumnName extends string>({
  children,
  columns,
  styles,
  visibilityMap,
  stickyColumns,
  isGlobalScroll = false,
  isLoading = false
}: PropsTypes<TColumnName>) {
  const [tableContainerWidth, setTableContainerWidth] = useDataValidator<number>(0);

  return (
    <CustomTableContext.Provider
      value={{
        stickyColumns: 12
      }}
    >
      {children}
    </CustomTableContext.Provider>
  );
}
