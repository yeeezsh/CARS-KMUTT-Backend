import AreaQuotaUnitEnum from '../@enums/area.quota.unit.enum';

type QuotaType = {
  requestor: {
    n: number;
    unit: AreaQuotaUnitEnum;
  };
};

export default QuotaType;
