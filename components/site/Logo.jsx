export default function Logo({ brand = {}, light = true }) {
  if (brand.logo) {
    return <img src={brand.logo} alt={brand.fullName || brand.name} className="h-10 w-auto object-contain" />;
  }
  return (
   <img src={'../../images/logo.png'} alt={'itika ecommerce'} className="w-[100px] h-auto object-contain" />
  );
}
