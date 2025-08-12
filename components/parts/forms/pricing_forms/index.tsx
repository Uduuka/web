import { FixedPricingForm } from "./FixedPricingForm";
import { MenuPricingForm } from "./MenuPricingForm";
import { RangePricingForm } from "./RangePricingForm";
import { RecurringPricingForm } from "./RecurringPricingForm";
import { UnitPricingForm } from "./UnitPricingForm";

const PricingForms: any = {
  fixed: FixedPricingForm,
  menu: MenuPricingForm,
  range: RangePricingForm,
  recurring: RecurringPricingForm,
  unit: UnitPricingForm,
};

export default PricingForms;
