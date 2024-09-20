interface pageginate {
  limit?: number;
  page?: number;
}

interface Options {
  limit?: number;
  skip?: number;
}
interface DateFillter {
  startDate?: string;
  endDate?: string;
}
interface Search {
  searchField?: string[];
  q?: string;
}
interface Conditions {
  isActive?: boolean;
}
interface Con {
  field?: string;
  value?: string;
}

interface Props {
  dateFillter?: DateFillter;
  search?: Search;
  sort?: number;
  pageginate?: pageginate;
  condition?: Con[];
}

interface ReturnProps {
  conditions?: Conditions;
  options?: Options;
}

export const getQueryString = (props?: Props): ReturnProps | null => {
  try {
    let options = {};
    let conditions = {};
    if (props?.pageginate?.limit && props?.pageginate.page) {
      const skip =
        props?.pageginate?.limit * props?.pageginate?.page -
        props?.pageginate?.limit;
      options = { ...options, limit: props?.pageginate?.limit, skip: skip };
    }
    if (props?.dateFillter?.startDate && props?.dateFillter?.endDate) {
      conditions = {
        ...conditions,
        createdAt: {
          $gte: new Date(props?.dateFillter?.startDate + 'T00:00:00.000Z'),
          $lt: new Date(props?.dateFillter?.endDate + 'T23:59:59.000Z'),
        },
      };
    }
    if (props?.sort) {
      options = { ...options, sort: { createdAt: props?.sort } };
    }

    const searchData = [];
    if (
      props?.search?.searchField &&
      props?.search?.searchField?.length > 0 &&
      props?.search?.q
    ) {
      for (let i = 0; i < props?.search?.searchField?.length; i++) {
        searchData.push({
          [`${props?.search?.searchField[i]}`]: {
            $regex: '.*' + props?.search?.q + '.*',
            $options: 'i',
          },
        });
      }
    }
    if (searchData.length > 0) {
      conditions = { ...conditions, ...{ $or: searchData } };
    }
    if (props?.condition && props?.condition?.length > 0) {
      for (let i = 0; i < props?.condition?.length; i++) {
        conditions = {
          ...conditions,
          ...{ [`${props?.condition[i].field}`]: props?.condition[i].value },
        };
      }
    }
    const result = {
      conditions: { ...conditions, isActive: true },
      options,
    };
    return result;
  } catch (_error) {
    // console.log(_error);

    return null;
  }
};
