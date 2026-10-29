#!/usr/bin/env bash
# Downloads the project photos published by NG-CDF Nyeri Town (nyeri-town.ngcdf.go.ke)
# into src/assets/projects, named so the site matches them to the right project.
# Run from the project folder:  bash scripts/get-project-photos.sh
set -u
cd "$(dirname "$0")/.."
mkdir -p src/assets/projects
ok=0; fail=0
get() {
  local name="$1" url="$2" ext="${2##*.}"
  if curl -fsSL --retry 2 -o "src/assets/projects/$name.$ext" "$url"; then echo "  saved  $name.$ext"; ok=$((ok+1)); else echo "  FAILED $name  ($url)"; fail=$((fail+1)); fi
}
echo 'Downloading NG-CDF project photos...'
get thunguma-ablution "https://nyeri-town.ngcdf.go.ke/wp-content/uploads/2026/09/Thunguma-Primary-School-FY-2023-2024-Complete-scaled.jpg"
get moi-complex-classrooms "https://nyeri-town.ngcdf.go.ke/wp-content/uploads/2026/09/Moi-Complex-Primary-School-Two-Classrooms-FY-2023-2024-scaled.jpg"
get muthuaini-ablution "https://nyeri-town.ngcdf.go.ke/wp-content/uploads/2026/09/MG_2127-scaled.jpg"
get giakanja-classroom "https://nyeri-town.ngcdf.go.ke/wp-content/uploads/2026/09/IMG-20250728-WA0179-1-scaled.jpg"
get tetu-boys-ablution "https://nyeri-town.ngcdf.go.ke/wp-content/uploads/2026/09/IMG-20250728-WA0020-scaled.jpg"
get kihuyo-lab "https://nyeri-town.ngcdf.go.ke/wp-content/uploads/2026/09/MG_2191.jpg"
get kamuyu-lab "https://nyeri-town.ngcdf.go.ke/wp-content/uploads/2026/09/MG_2137-scaled-e1789556153678.jpg"
get kahiga-dining-furniture "https://nyeri-town.ngcdf.go.ke/wp-content/uploads/2026/09/Kahiga-Secondary-School-Supply-of-Dining-Hall-furnitures-FY-2024-2025.jpeg"
get chorongi-chiefs-office "https://nyeri-town.ngcdf.go.ke/wp-content/uploads/2026/09/Chorongi-Assistant-Chiefs-Office-FY-2024-2025.jpeg"
get rware-admin "https://nyeri-town.ngcdf.go.ke/wp-content/uploads/2026/09/IMG-20250728-WA0055-scaled.jpg"
get gitathiini-admin "https://nyeri-town.ngcdf.go.ke/wp-content/uploads/2021/09/IMG_20250807_125350.jpg"
echo "Done: $ok saved, $fail failed. Now run: npm run build"
