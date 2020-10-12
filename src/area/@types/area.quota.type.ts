import AreaQuotaUnitEnum from '../@enums/area.quota.unit.enum';

type AreaQuotaType = {
  requestor: {
    n: number;
    unit: AreaQuotaUnitEnum;
  };
};

export default AreaQuotaType;
