
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users2 } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Development Control Officers | KASUPDA',
  description: 'List of Development Control Department Patrol Teams and their areas of coverage.',
};

const officers = [
  { name: "Jibril Abubakar Sultan", area: "UNG. Rimi, UNG. Sarki, Malali, Badarawa." },
  { name: "Sadiya Yusuf", area: "Central Area" },
  { name: "Godiya Ishaya", area: "Kurmin Mashi, Gwamna road, Badikko, Hayin Banki, NASFAT, Ung. Shanu, Ung.Kanawa, Abakwa." },
  { name: "Hassan Sabo", area: "Kabala, Marafa, shooting Range." },
  { name: "Suleiman Balarabe", area: "Barakallahu, Hayin dogo, Ung.Hazo, Rigachikun." },
  { name: "Ahmed Abdullahi", area: "Trade Fair layout, NDC, KSDPC layout, Malalin Gabas." },
  { name: "Sani Aliyu Abdullahi", area: "Sobawa, Dankande, Maraba Jos, Birnin Yero Jaji." },
  { name: "Auwal Nuhu Birnin Gwari", area: "Keke A, Keke B, Keken Makera, Dokan Mai Jama'a, Sabon Vero." },
  { name: "Sani Idris", area: "Karji, Babban Saura, PW, Janruwa, Kamazo TPO.1272, Rimi." },
  { name: "Mustafa Suleiman", area: "Rigasa South, Miyatti Allah, Hayin Malam Bello, Nariya, Tudun Barde, Shanono." },
  { name: "Hassan Abdullahi", area: "Kabala West, Ung.Muazu, Bakin Ruwa(A.A.Youghurt area)." },
  { name: "Sani Abdulkadir Jamoh", area: "Unguwan Dosa, Kwaru." },
  { name: "Kennedy Poul Galadima", area: "Kakuri Makera, Romi, Romi New extension, Federal Housing" },
  { name: "Ahmed Usman Jajere", area: "Gonin Gora (West side), Government land, Government layout, Durumi, Lamigyi, Ung. Auta, Hayin katafawa, Hayin Dogo, UNG.Zhawu, Ung.Bije, UNG. Doma, Kakau." },
  { name: "Ahmadu Bello", area: "Mando link road, National Eye Center, Prison Camp layout, Airport road." },
  { name: "Yunusa Ahmed", area: "Rigasa North (Farin Gida), Dan Mani, Rimaye, Asikolaye, Bakin Ruwa(Albabello side) down to Train station." },
  { name: "Damilola Ajumobi, assisted by Mustafa Barau, Esther John.", area: "Danbushiya, TUC,FMH, Yardan Allah Housing Estate,Rhyno, Dan honu2 down to Eastern Bypass." },
  { name: "Ismail Ishaq (Danguggo)", area: "Gidan Daji, Sabon Gida, TPO833C, Kadaure, Ung.Ma'aji, Kyauta, Danhonu1, millennium City." },
  { name: "Ahmed Abdulhamid assisted by Nelson Levy.", area: "Maigero1(water intake), Maigero2, Old Kamazou, Kamazo G.R.A Area." },
  { name: "Abdulmalik Hamman Abba", area: "Barnawa, Narayi High'cost, NAFDAC layout." },
  { name: "Salma P. Dyeri", area: "Ung. Gwari, Kawo, Rafin Gaza, Hayin Na'iya." },
  { name: "Francis Simone", area: "Tsaunin Kura layout, Stello regularization plan, Chanchangi layout (our lady of Fatima), Ung. Bulus." },
  { name: "Kaza Zakariya", area: "Gbagyi Villa, Juji, ung.Gimbiya, Nitel Quarters, Sabo(Right hand side)." },
  { name: "Gabriel Cornelius", area: "Sabo (left hand side), Burnt bricks, Mahuta, KSDPC layout." },
  { name: "Marble Haruna", area: "Ung. Boro, Ung.Makama, Ung. Pama, Ung. Sunday, Old Television, NITEL layout (Television), Narayi Village." },
  { name: "Abubakar Abdulrashid", area: "Ung.Sunusi, Kinkinau, Tudun Wada, Tudun Nupawa, Lodge Layout." },
  { name: "Buhari Mohammed", area: "Agwa, Zokoroko, Kudendan." },
  { name: "Salome Ishaya", area: "Nissi Village, Ung.Tasu, Kapam, NNPC Qtrs. Oil Village, Maraban Rido up to Kasuwan Magani." },
];

export default function DevelopmentControlOfficersPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="max-w-5xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-block bg-primary text-primary-foreground p-3 rounded-full mx-auto mb-4">
              <Users2 className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
            Development Control Department Patrol Team
          </CardTitle>
          <CardDescription>
            List of patrol teams and their areas of coverage as of 23rd June 2025.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">S/N</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Area of Coverage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {officers.map((officer, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{officer.name}</TableCell>
                    <TableCell>{officer.area}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
