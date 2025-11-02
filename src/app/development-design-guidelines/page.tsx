
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, AlertTriangle, Info, CheckCircle, Home, FilePen, DraftingCompass, Building, Car, ShoppingCart, School, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';

export default function DevelopmentDesignGuidelinesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const sections = [
    {
      id: 'major-queries',
      title: 'Major Queries',
      keywords: 'major query planning standards',
      content: (
        <section>
            <h2 className="flex items-center text-xl font-semibold text-destructive mb-3">
              <AlertTriangle className="mr-3 h-6 w-6" /> Major Queries
            </h2>
            <p className="text-muted-foreground">
              A query is considered major if it falls within any of the below planning standards where an applicant fails to adhere to any of the requirements.
            </p>
          </section>
      )
    },
    {
      id: 'minor-queries',
      title: 'Minor Queries',
      keywords: 'minor query amendments site plan fence',
      content: (
        <section>
          <h2 className="flex items-center text-xl font-semibold text-primary mb-3">
            <ListChecks className="mr-3 h-6 w-6" /> Minor Queries
          </h2>
          <p className="text-muted-foreground mb-4">
            All architectural queries are considered major queries except for a few amendments that may not affect billing. These include:
          </p>
          <ul className="space-y-3 list-inside">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0" />
              <span>Reconciling site plan to conform with survey sketch.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0" />
              <span>Submitting fence plan.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-1 shrink-0" />
              <span>Some minor amendments on plans, especially dimensions where it is not legible. The applicant is expected to make them legible for proper vetting.</span>
            </li>
          </ul>
        </section>
      )
    },
    {
      id: 'residential-guidelines',
      title: 'Residential Development Guidelines',
      keywords: 'residential bungalow duplex flats setbacks coverage floors',
      content: (
        <section>
          <h2 className="flex items-center text-2xl font-bold text-primary mb-4 border-b pb-2">
            <Home className="mr-3 h-7 w-7" /> Residential Development Guidelines
          </h2>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plot Size</TableHead>
                  <TableHead>Density</TableHead>
                  <TableHead>Type of Development</TableHead>
                  <TableHead>Building Coverage % (Max.)</TableHead>
                  <TableHead>Setbacks (m)</TableHead>
                  <TableHead>Inter Building Setbacks</TableHead>
                  <TableHead>No. of Floors</TableHead>
                  <TableHead>No. of Structures</TableHead>
                  <TableHead>Ancilliary Facilities Allowed</TableHead>
                  <TableHead>No. of Families</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>&le; 450m&sup2;</TableCell>
                  <TableCell>High <br/><span className="text-xs text-muted-foreground">(Kaduna Metro)</span></TableCell>
                  <TableCell>Bungalow, Duplexes, Block of Flats or studio apartments</TableCell>
                  <TableCell>60</TableCell>
                  <TableCell>Building line subject to min. of 4m <br/> F: 4 (<span className="text-red-600">3</span>) <br/> S: 2; 2, (<span className="text-red-600">1.5</span>) <br/> B: 2 (<span className="text-red-600">1.5</span>)</TableCell>
                  <TableCell rowSpan={7} className="text-center align-middle writing-vertical-rl -rotate-180 p-2 border-l border-r">
                    AVERAGE HEIGHT OF THE BUILDINGS (3 METRES)
                  </TableCell>
                  <TableCell>1 - 3</TableCell>
                  <TableCell>2 GH/BQ Main</TableCell>
                  <TableCell>Parking: 6 No.; Ramp for the physically challenged; 4 trees (min.)</TableCell>
                  <TableCell>2 - 8</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>&ge; 450m&sup2; &lt; 600m&sup2;</TableCell>
                  <TableCell>High density adjoining commercial district employment centre</TableCell>
                  <TableCell>Block of flats</TableCell>
                  <TableCell>60% for every additional 2 floors, reduce coverage by 3%</TableCell>
                  <TableCell>F: 4 (<span className="text-red-600">3</span>) <br/> S: 2; 2, (<span className="text-red-600">1.5</span>) <br/> B: 2 (<span className="text-red-600">1.5</span>)</TableCell>
                  <TableCell>4 - 6</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>Lift and adequate alternative power supply must be provided. Basement parking for min of 4 additional lots for each additional floor</TableCell>
                  <TableCell>8 - 12 max</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>&ge; 600m&sup2; &lt; 900m&sup2;</TableCell>
                  <TableCell>Medium</TableCell>
                  <TableCell>Block of Flats / Terrace, Studio Apartments</TableCell>
                  <TableCell>50</TableCell>
                  <TableCell>F: 6 (<span className="text-red-600">3</span>) <br/> S: 3; 3 (<span className="text-red-600">1.5</span>) <br/> B: 3 (<span className="text-red-600">1.5</span>)</TableCell>
                  <TableCell>4</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>Parking: 12 No.; Ramp for the physically challenged; 6 trees (min.)</TableCell>
                  <TableCell>6</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>&ge; 900m&sup2; &lt; 2500m&sup2;</TableCell>
                  <TableCell>Low</TableCell>
                  <TableCell>Bungalows, Duplexes, Maisonette</TableCell>
                  <TableCell>40</TableCell>
                  <TableCell>F: 6 (<span className="text-red-600">3</span>) <br/> S: 3.5; 3.5(<span className="text-red-600">1.5</span>) <br/> B: 3 (<span className="text-red-600">1.5</span>)</TableCell>
                  <TableCell>Max. 2 suspended floor excluding a penthouse</TableCell>
                  <TableCell>2; made up of 1 principal and two (2) ancillary</TableCell>
                  <TableCell>Parking: 6; Soft landscaping 20% (min.); Swimming pool; Games court; Gazebo; Gate/generator house; 10 trees (min.)</TableCell>
                  <TableCell>Max 2</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell rowSpan={2}>&ge;2500m&sup2; &lt; 5000m&sup2;</TableCell>
                  <TableCell rowSpan={2}>Special Residential Plot</TableCell>
                  <TableCell>Luxury Flats; Service Flats;</TableCell>
                  <TableCell rowSpan={2}>40</TableCell>
                  <TableCell>F: 6<br/>S: 4; 4<br/>B: 4</TableCell>
                  <TableCell rowSpan={2}>** 4 - 6</TableCell>
                  <TableCell rowSpan={2}>2</TableCell>
                  <TableCell>Soft landscaping of not less than 30%; Swimming pool Games court Gazebo; Gate/generator house; Lift; 10 trees</TableCell>
                  <TableCell rowSpan={2}>N/A</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mixed Development</TableCell>
                  <TableCell>F: 6<br/>* S: 8; 8<br/>* B: 6</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>&ge; 5000m&sup2;</TableCell>
                  <TableCell>Comprehensive Development</TableCell>
                  <TableCell>Condominiums; Mixed Development; Terrace Building.</TableCell>
                  <TableCell>40</TableCell>
                  <TableCell>F: 15<br/>S: 8; 8<br/>B: 6</TableCell>
                  <TableCell>4 (min)</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>Parking; Soft landscaping; Outdoor Recreational facilities; Shopping; Day care; Swimming</TableCell>
                  <TableCell>N/A</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>-</TableCell>
                  <TableCell>Mass Housing</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>1 - 4</TableCell>
                  <TableCell></TableCell>
                  <TableCell>Parking: 2 per unit; Outdoor recreation; day care/crèche; retail shops; soft landscaping 20%; power plant; firefighting facilities; clinic; solid waste mgt; Centralized water supply system; encourage central sewage</TableCell>
                  <TableCell>N/A</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>-</TableCell>
                  <TableCell>Ancillary residential facilities</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>*** Crèches</TableCell>
                  <TableCell>N/A</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
           <div className="text-sm text-muted-foreground space-y-1 pt-4">
              <p><span className="font-bold">*</span> Where applicable</p>
              <p><span className="font-bold">**</span> All residential developments having more than three (3) suspended floors require a lift</p>
              <p><span className="font-bold">***</span> 1/5 of the depth of the shortest plot in the block shall be set aside as the building line subject to the minimum of 6m front setback</p>
          </div>
        </section>
      )
    },
    {
        id: 'development-query-details',
        title: 'Development Query Details',
        keywords: 'query details non-compliance parking setbacks',
        content: (
            <section>
            <h2 className="flex items-center text-2xl font-bold text-primary mb-4 border-b pb-2">
              <FilePen className="mr-3 h-7 w-7" /> Development Query Details
            </h2>
            <div className="border rounded-lg overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type of Development</TableHead>
                            <TableHead>Minor Quarries</TableHead>
                            <TableHead>Major Quarries</TableHead>
                            <TableHead>Remarks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <ul className="list-none space-y-1">
                                    <li>Bungalow Duplexes</li>
                                    <li>Block of Flats or studio apartments</li>
                                    <li>Block of flats</li>
                                    <li>Block of Flats / Terrace</li>
                                    <li>Studio Apartments</li>
                                    <li>Bungalows Duplexes Maisonette</li>
                                </ul>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-center text-primary">
                                <CheckCircle className="h-6 w-6 inline-block" />
                            </TableCell>
                            <TableCell>
                                <ul className="list-disc list-inside space-y-2 text-sm">
                                    <li>Non-compliance with minimum standards for setbacks and functional space sizes.</li>
                                    <li>Inadequate provision of designated parking spaces.</li>
                                    <li>Submission of designs with building scales that exceed plot sizes.</li>
                                    <li>Incomplete design submissions, omitting essential building features indicated on site plans.</li>
                                    <li>Failure to provide complete design details for all building elements shown on the site plan.</li>
                                    <li>Failure to meet the minimum 30% plot coverage requirement.</li>
                                    <li>Omission of remodeling schedules from design submissions.</li>
                                    <li>Incomplete or omitted section lines.</li>
                                    <li>Failure to meet these standard requirements may necessitate revisions or redesigns potentially leading to delays of billings.</li>
                                </ul>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                Luxury Flats; Service Flats;
                            </TableCell>
                             <TableCell></TableCell>
                            <TableCell className="text-center text-primary">
                                <CheckCircle className="h-6 w-6 inline-block" />
                            </TableCell>
                            <TableCell rowSpan={3}>
                                <ul className="list-disc list-inside space-y-2 text-sm">
                                    <li>The minimum distance between buildings within the site plan is sometimes not meet by applicants.</li>
                                    <li>The orientation of the buildings is sometimes not properly arranged.</li>
                                    <li>Non-compliance with minimum standards for setbacks and functional space sizes.</li>
                                    <li>Inadequate provision of designated parking spaces.</li>
                                    <li>Submission of designs with building scales that exceed plot sizes.</li>
                                    <li>Incomplete design submissions, omitting essential building features indicated on site plans.</li>
                                    <li>Failure to provide complete design drawings for all building elements shown on the site plan</li>
                                </ul>
                            </TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell>
                                Mixed Development
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-center text-primary">
                                <CheckCircle className="h-6 w-6 inline-block" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                Condominiums; Mixed Development; Terrace Building.
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-center text-primary">
                                <CheckCircle className="h-6 w-6 inline-block" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                Commercial Facilities
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-center text-primary">
                                <CheckCircle className="h-6 w-6 inline-block" />
                            </TableCell>
                            <TableCell>
                                <ul className="list-disc list-inside space-y-2 text-sm">
                                    <li>The minimum distance between buildings within the site plan is sometimes not meet by applicants.</li>
                                    <li>Non-compliance with minimum standards for setbacks and functional space sizes.</li>
                                    <li>Inadequate provision of designated parking spaces.</li>
                                </ul>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Educational institutions</TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-center text-primary">
                                <CheckCircle className="h-6 w-6 inline-block" />
                            </TableCell>
                            <TableCell>
                                <ul className="list-disc list-inside space-y-2 text-sm">
                                    <li>Lack of provision of designated playground.</li>
                                    <li>The minimum distance between buildings within the site plan is sometimes not meet by applicants.</li>
                                    <li>Non-compliance with minimum standards for setbacks and functional space sizes.</li>
                                    <li>Inadequate provision of designated parking spaces.</li>
                                    <li>Submission of designs with building scales that exceed plot sizes.</li>
                                    <li>Incomplete design submissions, omitting essential building features indicated on site plans.</li>
                                    <li>Failure to provide complete design drawings for all building elements shown on the site plan.</li>
                                    <li>Failure to meet the minimum 30% plot coverage requirement.</li>
                                    <li>Omission of remodeling schedules from design submissions.</li>
                                    <li>Incomplete or omitted section lines.</li>
                                    <li>Failure to meet these standard requirements may necessitate revisions or redesigns potentially leading to delays of billings.</li>
                                </ul>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
          </section>
        )
    },
    {
        id: 'kasupda-manual-note',
        title: 'Note about KASUPDA Manual',
        keywords: 'kasupda manual red text vetting',
        content: (
            <section>
                <div className="bg-muted/50 border-l-4 border-primary p-4 rounded-r-lg">
                    <h3 className="flex items-center text-lg font-semibold text-primary mb-2">
                        <Info className="mr-3 h-5 w-5" /> Note
                    </h3>
                    <p className="text-sm text-foreground">
                        Text in <span className="text-red-600 font-semibold">red</span> represent our adopted setbacks whereas the text in black is the KASUPDA Manual which has generally been adopted and being used as a guide in vetting.
                    </p>
                     <p className="text-sm text-muted-foreground mt-2">
                        <span className="font-semibold">KASUPDA MANUAL which is generally adopted without changes except for the text in red.</span>
                    </p>
                </div>
            </section>
        )
    },
    {
        id: 'space-definitions',
        title: 'Space Definition and dimensions',
        keywords: 'space definition dimensions living room bedroom kitchen toilet',
        content: (
            <section>
            <h2 className="flex items-center text-2xl font-bold text-primary mb-4 border-b pb-2">
              <DraftingCompass className="mr-3 h-7 w-7" /> Space Definition and their dimensions
            </h2>
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S/N</TableHead>
                    <TableHead>Space Definitions</TableHead>
                    <TableHead>Basic Minimum (m&sup2;)</TableHead>
                    <TableHead>Minimum Side Dimension (m)</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell>i</TableCell><TableCell>Living Room</TableCell><TableCell>12</TableCell><TableCell>3.0</TableCell><TableCell>Adopted the manual without any changes</TableCell></TableRow>
                  <TableRow><TableCell>ii</TableCell><TableCell>Dining Room</TableCell><TableCell>7.5</TableCell><TableCell>2.4</TableCell><TableCell></TableCell></TableRow>
                  <TableRow><TableCell>iii</TableCell><TableCell>Bedrooms</TableCell><TableCell>10</TableCell><TableCell>3.0</TableCell><TableCell></TableCell></TableRow>
                  <TableRow><TableCell>iv</TableCell><TableCell>Toilets (Bath/WC)</TableCell><TableCell>3.6</TableCell><TableCell>1.5</TableCell><TableCell></TableCell></TableRow>
                  <TableRow><TableCell>v</TableCell><TableCell>Toilets (WC only)</TableCell><TableCell>1.5</TableCell><TableCell>0.90</TableCell><TableCell></TableCell></TableRow>
                  <TableRow><TableCell>vi</TableCell><TableCell>Garage</TableCell><TableCell>16.5</TableCell><TableCell>3.0</TableCell><TableCell></TableCell></TableRow>
                  <TableRow><TableCell>vii</TableCell><TableCell>Car Park</TableCell><TableCell>12.5</TableCell><TableCell>2.4</TableCell><TableCell></TableCell></TableRow>
                  <TableRow><TableCell>viii</TableCell><TableCell>Kitchenette</TableCell><TableCell>4</TableCell><TableCell>1.5</TableCell><TableCell></TableCell></TableRow>
                  <TableRow><TableCell>ix</TableCell><TableCell>Kitchen</TableCell><TableCell>6.0</TableCell><TableCell>1.8</TableCell><TableCell></TableCell></TableRow>
                  <TableRow><TableCell>x</TableCell><TableCell>Stores</TableCell><TableCell>3.0</TableCell><TableCell>1.2</TableCell><TableCell></TableCell></TableRow>
                  <TableRow><TableCell>xi</TableCell><TableCell>Corridors (Width)</TableCell><TableCell>1.5</TableCell><TableCell>1.2</TableCell><TableCell></TableCell></TableRow>
                  <TableRow><TableCell>xii</TableCell><TableCell>Headroom (Height)</TableCell><TableCell>2.85m</TableCell><TableCell>-</TableCell><TableCell></TableCell></TableRow>
                  <TableRow><TableCell>xiii</TableCell><TableCell>Balcony (Width)</TableCell><TableCell>1.2</TableCell><TableCell>0.9</TableCell><TableCell></TableCell></TableRow>
                  <TableRow>
                    <TableCell>xiv</TableCell>
                    <TableCell>
                        Staircase:
                        <ul className="list-disc pl-5 mt-1">
                            <li>Width</li>
                            <li>Riser</li>
                            <li>Thread</li>
                        </ul>
                    </TableCell>
                    <TableCell>
                      <ul className="list-none mt-1 space-y-2">
                          <li>1.2m</li>
                          <li>150mm</li>
                          <li>250mm</li>
                      </ul>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="text-sm text-muted-foreground space-y-1 pt-4 list-outside">
                <p>d. Room sizes do not include wardrobe space.</p>
                <p>e. A lift shall be provided for the physically challenged in high rise residential buildings.</p>
                <p>f. Courtyard to be 25% of floor area of adjoining rooms/corridors; minimum side dimension 3m.</p>
            </div>
          </section>
        )
    },
    {
        id: 'commercial-guidelines',
        title: 'Architectural Guidelines for Commercial/Office Facilities',
        keywords: 'commercial office facilities entrance shop parking toilet staircase',
        content: (
            <section>
            <h2 className="flex items-center text-2xl font-bold text-primary mb-4 border-b pb-2">
              <Building className="mr-3 h-7 w-7" /> Architectural Guidelines for Commercial/Office Facilities
            </h2>
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Space</TableHead>
                    <TableHead>Basic Min.</TableHead>
                    <TableHead>Desirable Min.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Entrance Area</TableCell>
                    <TableCell>20 - 25m&sup2;</TableCell>
                    <TableCell>30 - 35m&sup2;</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Office Area</TableCell>
                    <TableCell>12m&sup2;</TableCell>
                    <TableCell>16m&sup2;</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Shop Area</TableCell>
                    <TableCell>12m&sup2;</TableCell>
                    <TableCell>16m&sup2;</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Parking Space</TableCell>
                    <TableCell colSpan={2} className="text-center">1 parking space per 75m&sup2; floor area</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Toilets</TableCell>
                    <TableCell>0.9 x 1.8</TableCell>
                    <TableCell>1.2 x 2.0 / 1 toilet / 15</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Stair cases (width)
                    </TableCell>
                    <TableCell>
                        <ul className="list-none space-y-1">
                            <li>Width 1.5m</li>
                            <li>Riser 150mm</li>
                            <li>Tread 230</li>
                        </ul>
                    </TableCell>
                    <TableCell>
                        <ul className="list-none space-y-1">
                            <li>1.8m</li>
                            <li>175mm</li>
                            <li>300mm (T+2R=550-700mm Max.)</li>
                        </ul>
                    </TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>Conference / Meeting Area</TableCell>
                    <TableCell>0.65m&sup2; / person</TableCell>
                    <TableCell>0.85m&sup2; / person</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cafeteria / Restaurant Area</TableCell>
                    <TableCell>0.65m&sup2; / person</TableCell>
                    <TableCell>0.85m&sup2; / person</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="text-sm text-muted-foreground space-y-1 pt-4 list-outside">
                <p><span className="font-bold">Note:</span> Lifts shall be provided for building of 3 suspended floors and above.</p>
                <p>Ramps should be provided at entry points for disabled persons in all commercial/offices from ground floor.</p>
            </div>
          </section>
        )
    },
    {
        id: 'parking-guidelines-commercial',
        title: 'Parking Guidelines for Commercial Facilities',
        keywords: 'parking commercial bed breakfast hotel restaurant heavy goods physically challenged',
        content: (
            <section>
            <h2 className="flex items-center text-2xl font-bold text-primary mb-4 border-b pb-2">
              <Car className="mr-3 h-7 w-7" /> Parking Guidelines for Commercial Facilities
            </h2>
            <div className="border rounded-lg overflow-x-auto mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Uses</TableHead>
                    <TableHead>Requirements</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Bed and Breakfast and Guest Houses</TableCell>
                    <TableCell>1 car space per bedroom plus resident staff accommodation as in KD.PS 19 above.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Hotels and Motels</TableCell>
                    <TableCell>1 car space per bedroom, plus 1 space for every 7m&sup2; of net area used by the public, plus 1 luxury bus space per 100 bedrooms in hotels with more than 100 rooms, operational parking and servicing as appropriate.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Restaurants and Cafés</TableCell>
                    <TableCell>1 vehicle space per 7m&sup2; for areas used by the public. This is inclusive of operational and staff parking.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="space-y-4 text-sm text-foreground">
              <p>Commercial buildings are to be designed to suit space and servicing requirements of potential users. However, the Authority shall also consider the implications of the proposed development being occupied by other users, being subdivided or units being combined. A similar approach may be adopted with retail uses:</p>
              
              <div className="pl-4">
                <h3 className="font-semibold text-md mb-2">a. Standard for the Physically Challenged in Commercial Developments:</h3>
                <p className="text-muted-foreground">Parking provision will be calculated on the basis of the 15% minimum standards set out in subsequent paragraphs. These should be clearly marked and reserved for the use of physically challenged persons. They should be located near to the entrance of the buildings for which they are provided.</p>
              </div>

              <div className="pl-4">
                <h3 className="font-semibold text-md mb-2">b. Parking Dimensions:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Parking bay sizes are normally 2.4m wide by 4.8m long except where such bays are positioned parallel to the kerb where bay sizes should be 1.8m wide and 6.0m long.</li>
                    <li>Parking bays for physically challenged people should normally be 3.6m wide by 4.8m long to provide sufficient room for side transfer between wheelchairs and cars or light vans. One (1), 1.2 meters wide, transfer space may service two parking bays.</li>
                    <li>Heavy goods vehicle parking bays should normally be 3.5m wide by 15.25m long but can be varied according to the type of vehicle expected to use them.</li>
                </ul>
              </div>

              <div className="pl-4">
                <h3 className="font-semibold text-md mb-2">c. Heavy Goods Vehicles:</h3>
                <p className="text-muted-foreground">Parking provision for Lorries and other heavy goods vehicles within the boundaries of development sites should be made in accordance with the standards set out in the tables below. These apply as minimum standards.</p>
              </div>

               <div className="pl-4">
                <h3 className="font-semibold text-md mb-2">d. Parking Standards for Shopping Developments:</h3>
                <p className="text-muted-foreground">Maximum provision with the exception of heavy goods vehicles.</p>
              </div>
            </div>
          </section>
        )
    },
    {
        id: 'parking-guidelines-shopping',
        title: 'Parking Guidelines for Shopping Developments',
        keywords: 'parking shopping retail supermarkets hypermarkets warehouses garden centers',
        content: (
            <section>
            <h2 className="flex items-center text-2xl font-bold text-primary mb-4 border-b pb-2">
              <ShoppingCart className="mr-3 h-7 w-7" /> Parking Guidelines for Shopping Developments
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">1. General Retail</h3>
                <div className="border rounded-lg overflow-x-auto">
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Shops (take-away food shops with fewer than 8 customer seats).</TableCell>
                                <TableCell>A maximum of 1 car space for every 40m&sup2; gross floor area (Gross Floor Area GFA) with provision of at least 1 for every shop, plus access to an off street delivery bay.</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell colSpan={2}>
                                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                        <li>The parking standards include provision for essential operational parking and servicing, other shop workers and shoppers.</li>
                                    </ul>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2}>There should be adequate provision for overnight parking of delivery vehicles and for the parking and maneuvering of vehicles in loading areas.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">2. Supermarkets, Superstores and Hypermarkets i.e. stores selling primarily food and groceries</h3>
                 <div className="border rounded-lg overflow-x-auto">
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Over 1,200m&sup2;</TableCell>
                                <TableCell>1 car space per 15m&sup2; GFA.</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell colSpan={2}>In addition, there should be adequate provision for overnight parking of delivery vehicles and for the parking and maneuvering of vehicles in loading areas.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                 </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">3. Retail Warehouses and Garden Centers</h3>
                 <div className="border rounded-lg overflow-x-auto">
                    <Table>
                        <TableBody>
                             <TableRow>
                                <TableCell className="font-medium">Over 1,200m&sup2;</TableCell>
                                <TableCell>1 car space per 20m&sup2; GFA.</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell colSpan={2}>The floor area includes outdoor sales and display areas. In addition, there should be adequate provision for overnight parking of delivery vehicles and for the parking and maneuvering of vehicles in loading areas.</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
              </div>
              <div className="space-y-4 text-sm text-foreground pt-4">
                  <p className="text-muted-foreground">As much as possible, consideration be given to the impact of trips generated on adjacent uses, particularly residential, and on the effect of casual on-street parking on traffic flows including any likely congestion of bus lay-bys and bus stops or interruptions to the free flow and safety of traffic or pedestrians.</p>
                  <p className="text-muted-foreground">Proposals for individual shops that generate a requirement for 30 or more parking spaces should normally provide these adjacent to the store and include provision for disabled persons. The parking requirement for smaller shops may be "pooled" or commuted into public car parks.</p>
              </div>
            </div>
          </section>
        )
    },
    {
        id: 'educational-institutions',
        title: 'Educational Institutions',
        keywords: 'educational institutions school primary secondary nursery standards',
        content: (
             <section>
            <h2 className="flex items-center text-2xl font-bold text-primary mb-4 border-b pb-2">
                <School className="mr-3 h-7 w-7" /> Educational Institutions
            </h2>
            <div>
                <h3 className="text-lg font-semibold mb-2">Planning Standards</h3>
                <ul className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
                    <li>All school site designs shall allow for use of any local recreational facility intended for the use of the residents served by the primary school.</li>
                    <li>Landscaping of school sites shall meet the minimum requirements of the residential area in which it is located.</li>
                    <li>Areas of impervious surface shall not exceed 20% of total site.</li>
                    <li>Structures within primary schools shall be of single floors and where not feasible, shall not exceed two (2) floors.</li>
                    <li>Post primary institutions shall not exceed three (3) floors.</li>
                    <li>Facilities that will serve purely academic uses shall not exceed four (4) floors.</li>
                    <li>There shall be a functional separation of pedestrian and vehicular traffic.</li>
                    <li>All noise producing activities shall be zoned away to keep disturbances away from classrooms.</li>
                </ul>
                <p className="text-sm text-muted-foreground mb-4">The planning standards in the table below shall apply to primary and secondary schools. While the standards set for recreational facilities is minimum. Other standards may vary depending on priority of the school and amount of land available.</p>

                <h3 className="text-lg font-semibold mb-2 mt-6">Planning Standards for Educational Institutions</h3>
                <div className="border rounded-lg overflow-x-auto mb-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Facility</TableHead>
                                <TableHead>Plot % Coverage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Academic Building</TableCell>
                                <TableCell>30 - 45%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Admin Block</TableCell>
                                <TableCell>0.2 - 1%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Staff Housing, Hostels</TableCell>
                                <TableCell>&lt; 5%</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Recreational Facility</TableCell>
                                <TableCell>&lt; 30%</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <div className="border rounded-lg overflow-x-auto mb-6">
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Ancillary Facilities - school workshop, laboratories etc.</TableCell>
                                <TableCell>As appropriate</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                
                <div className="mb-6 space-y-1 text-sm">
                    <p><span className="font-semibold">GROUP 1:</span> (Nursery, Primary & Junior Secondary)</p>
                    <p><span className="font-semibold">GROUP 2:</span> (Senior Secondary)</p>
                    <p><span className="font-semibold">GROUP 3:</span> (Higher Institutions)</p>
                </div>

                <h3 className="text-lg font-semibold mb-2 mt-6">GROUP 1 Nursery, Primary and Junior Secondary</h3>
                <div className="border rounded-lg overflow-x-auto mb-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>S/No.</TableHead>
                                <TableHead>Space</TableHead>
                                <TableHead>Basic Area</TableHead>
                                <TableHead>Window %</TableHead>
                                <TableHead>Min Dim (m)</TableHead>
                                <TableHead>Door (m)</TableHead>
                                <TableHead>Head Room (m)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow><TableCell>1.</TableCell><TableCell>Play Area (Interior)</TableCell><TableCell>25m&sup2;</TableCell><TableCell>40</TableCell><TableCell>5.0</TableCell><TableCell>0.9</TableCell><TableCell>-</TableCell></TableRow>
                            <TableRow><TableCell>2.</TableCell><TableCell>Kitchenette</TableCell><TableCell>6m&sup2;</TableCell><TableCell>10</TableCell><TableCell>2.0</TableCell><TableCell>0.75</TableCell><TableCell>3.0</TableCell></TableRow>
                            <TableRow><TableCell>3.</TableCell><TableCell>Laundry</TableCell><TableCell>6m&sup2;</TableCell><TableCell>10</TableCell><TableCell>2.0</TableCell><TableCell>0.75</TableCell><TableCell>3.0</TableCell></TableRow>
                            <TableRow><TableCell>4.</TableCell><TableCell>Toilet</TableCell><TableCell colSpan={5}>As in commercial</TableCell></TableRow>
                            <TableRow><TableCell>5.</TableCell><TableCell>Office</TableCell><TableCell colSpan={5}>As in commercial</TableCell></TableRow>
                            <TableRow><TableCell>6.</TableCell><TableCell>Classroom</TableCell><TableCell>36m&sup2;</TableCell><TableCell>30</TableCell><TableCell>6.0</TableCell><TableCell>1.2</TableCell><TableCell>3.0</TableCell></TableRow>
                            <TableRow><TableCell>7.</TableCell><TableCell>Laboratory</TableCell><TableCell>50m&sup2;</TableCell><TableCell>30</TableCell><TableCell>6.0</TableCell><TableCell>1.2</TableCell><TableCell>3.0</TableCell></TableRow>
                            <TableRow><TableCell>8.</TableCell><TableCell>Sick Bay</TableCell><TableCell>3.1m&sup2;/bedspace</TableCell><TableCell>40</TableCell><TableCell>4.0</TableCell><TableCell>1.2</TableCell><TableCell>3.0</TableCell></TableRow>
                            <TableRow><TableCell>9.</TableCell><TableCell>Multi-purpose Hall</TableCell><TableCell>150m&sup2;</TableCell><TableCell>30</TableCell><TableCell>10.0</TableCell><TableCell>1.2</TableCell><TableCell>6.0</TableCell></TableRow>
                            <TableRow><TableCell>10.</TableCell><TableCell>Dining Area</TableCell><TableCell>0.85m&sup2;/person</TableCell><TableCell>30</TableCell><TableCell>4.0</TableCell><TableCell>1.2</TableCell><TableCell>3.0</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </div>
                
                <h3 className="text-lg font-semibold mb-2 mt-6">GROUP 2 Senior Secondary</h3>
                <div className="border rounded-lg overflow-x-auto mb-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>S/N</TableHead>
                                <TableHead>Space</TableHead>
                                <TableHead>Basic Area</TableHead>
                                <TableHead>Window %</TableHead>
                                <TableHead>Min Dim (m)</TableHead>
                                <TableHead>Door (m)</TableHead>
                                <TableHead>Head Room (m)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>1</TableCell>
                                <TableCell>Lecture Hall</TableCell>
                                <TableCell>0.85 m&sup2;/person</TableCell>
                                <TableCell>40</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>1.5</TableCell>
                                <TableCell>3.5</TableCell>
                            </TableRow>
                            <TableRow><TableCell>2.</TableCell><TableCell>Laboratory</TableCell><TableCell>36m&sup2;</TableCell><TableCell>30</TableCell><TableCell>-</TableCell><TableCell>1.2</TableCell><TableCell>3.0</TableCell></TableRow>
                            <TableRow><TableCell>3.</TableCell><TableCell>Library</TableCell><TableCell>1.2m&sup2;/person</TableCell><TableCell>40</TableCell><TableCell>-</TableCell><TableCell>1.2</TableCell><TableCell>3.0</TableCell></TableRow>
                            <TableRow><TableCell>4.</TableCell><TableCell>Cafeteria</TableCell><TableCell>0.85m&sup2;/person</TableCell><TableCell>30</TableCell><TableCell>-</TableCell><TableCell>1.2</TableCell><TableCell>3.0</TableCell></TableRow>
                            <TableRow><TableCell>5.</TableCell><TableCell>Admin Block</TableCell><TableCell>40m&sup2;</TableCell><TableCell>10</TableCell><TableCell>-</TableCell><TableCell>1.2</TableCell><TableCell>3.0</TableCell></TableRow>
                            <TableRow><TableCell>6.</TableCell><TableCell>Multi-purpose Hall</TableCell><TableCell>0.65m&sup2;/person</TableCell><TableCell>30</TableCell><TableCell>-</TableCell><TableCell>1.2</TableCell><TableCell>3.5</TableCell></TableRow>
                            <TableRow><TableCell>7.</TableCell><TableCell>Hostels</TableCell><TableCell>3.1m&sup2;/bed space</TableCell><TableCell>40</TableCell><TableCell>-</TableCell><TableCell>0.9</TableCell><TableCell>3.0</TableCell></TableRow>
                            <TableRow><TableCell>8.</TableCell><TableCell>Sick Bay</TableCell><TableCell>3.1m&sup2;/per bs</TableCell><TableCell>30</TableCell><TableCell>-</TableCell><TableCell>0.9</TableCell><TableCell>3.0</TableCell></TableRow>
                            <TableRow><TableCell>9.</TableCell><TableCell>Toilet</TableCell><TableCell>1.35m&sup2;</TableCell><TableCell>10</TableCell><TableCell>-</TableCell><TableCell>0.75</TableCell><TableCell>3.0</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </div>
                 <h3 className="text-lg font-semibold mb-2 mt-6">GROUP 3 Higher Institutions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Architectural Standards for various Categories of Schools shall be as stipulated in the Table below
                </p>
                <div className="border rounded-lg overflow-x-auto mb-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>CRITERIA</TableHead>
                                <TableHead>NURSERY SCHOOL</TableHead>
                                <TableHead>PRIMARY SCHOOL</TableHead>
                                <TableHead>SECONDARY SCHOOL</TableHead>
                                <TableHead colSpan={2} className="text-center">AREA</TableHead>
                                <TableHead>HEAD ROOM (m)</TableHead>
                            </TableRow>
                            <TableRow>
                                <TableHead></TableHead>
                                <TableHead></TableHead>
                                <TableHead></TableHead>
                                <TableHead></TableHead>
                                <TableHead>MIN</TableHead>
                                <TableHead>PREFERRED</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Maximum no. of pupils per class</TableCell>
                                <TableCell>15</TableCell>
                                <TableCell>30</TableCell>
                                <TableCell>40</TableCell>
                                <TableCell>36 m&sup2;</TableCell>
                                <TableCell>42 m&sup2;</TableCell>
                                <TableCell>3.0</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Toilet</TableCell>
                                <TableCell>1:10 persons</TableCell>
                                <TableCell>1:15 person</TableCell>
                                <TableCell>1:10 person</TableCell>
                                <TableCell>0.9 x 1.5</TableCell>
                                <TableCell>1.2 x 2.0</TableCell>
                                <TableCell>3.0</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Multipurpose Hall</TableCell>
                                <TableCell>75</TableCell>
                                <TableCell>150</TableCell>
                                <TableCell>200</TableCell>
                                <TableCell>300 m&sup2;</TableCell>
                                <TableCell>450 m&sup2;</TableCell>
                                <TableCell>6.0</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Staff toilet</TableCell>
                                <TableCell>1:5 person</TableCell>
                                <TableCell>1:5 person</TableCell>
                                <TableCell>1:5 person</TableCell>
                                <TableCell>0.9 x 1.5</TableCell>
                                <TableCell>1.2 x 2.0</TableCell>
                                <TableCell>3.0</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Computer use</TableCell>
                                <TableCell>1:5 person</TableCell>
                                <TableCell>1:5 person</TableCell>
                                <TableCell>1:2 person</TableCell>
                                <TableCell>36 m&sup2;</TableCell>
                                <TableCell>42 m&sup2;</TableCell>
                                <TableCell>3.0</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Admin. Block per staff</TableCell>
                                <TableCell>1:2</TableCell>
                                <TableCell>1:2</TableCell>
                                <TableCell>1:2</TableCell>
                                <TableCell>12 m&sup2;</TableCell>
                                <TableCell>16 m&sup2;</TableCell>
                                <TableCell>3.0</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Shops area</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>12 m&sup2;</TableCell>
                                <TableCell>16 m&sup2;</TableCell>
                                <TableCell>3.0</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Library area</TableCell>
                                <TableCell>0.65m&sup2;/person</TableCell>
                                <TableCell>0.65m&sup2;/person</TableCell>
                                <TableCell>0.65m&sup2;/person</TableCell>
                                <TableCell>150 m&sup2;</TableCell>
                                <TableCell>180 m&sup2;</TableCell>
                                <TableCell>3.5-4</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Clinic</TableCell>
                                <TableCell>3.1m&sup2;/bed space</TableCell>
                                <TableCell>3.1m&sup2;/bed space</TableCell>
                                <TableCell>3.1m&sup2;/bedspace</TableCell>
                                <TableCell>100 m&sup2;</TableCell>
                                <TableCell>150 m&sup2;</TableCell>
                                <TableCell>3.0</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Office</TableCell>
                                <TableCell>1:2/person</TableCell>
                                <TableCell>1:2/person</TableCell>
                                <TableCell>1:2/person</TableCell>
                                <TableCell>12 m&sup2;</TableCell>
                                <TableCell>16 m&sup2;</TableCell>
                                <TableCell>3.0</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Canteen</TableCell>
                                <TableCell>0.85m&sup2;/person</TableCell>
                                <TableCell>0.85m&sup2;/person</TableCell>
                                <TableCell>0.85m&sup2;/person</TableCell>
                                <TableCell>20 m&sup2;</TableCell>
                                <TableCell>24 m&sup2;</TableCell>
                                <TableCell>3.0</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div className="text-sm text-muted-foreground space-y-1 pt-4">
                    <p><span className="font-bold">Note:</span> For pupils of pre-school age in nursery schools and kindergarten buildings should be connected by covered walkways to provide shade and shelter. This also applies within individual hostels.</p>
                </div>

                <h3 className="text-lg font-semibold mb-2 mt-6">Parking Standards</h3>
                 <div className="border rounded-lg overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Car Parking Requirements for Educational Developments.</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Hostels related to schools, colleges training and military accommodation</TableCell>
                                <TableCell>1 car space for every 3 bed spaces, plus staff accommodation, as in KD.PS 19residential hostels</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Primary and secondary schools</TableCell>
                                <TableCell>1 car space for every member of staff.</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Day nurseries and crèches</TableCell>
                                <TableCell>1 car space for every member of staff.</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Colleges of higher or further education and other educational establishments</TableCell>
                                <TableCell>1 car space for every two members of staff plus 1 space for every 15 students.</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell></TableCell>
                                <TableCell>1 Car space to every 5 member staff</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>1 Car space to every 5 member of staff</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
          </section>
        )
    }
  ];

  const filteredSections = sections.filter(section => {
    if (!searchTerm) return true;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const keywords = `${section.title} ${section.keywords}`.toLowerCase();
    return keywords.includes(lowerCaseSearchTerm);
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Card className="max-w-6xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
            Architectural Guidelines
          </CardTitle>
          <CardDescription>
            Official guidelines for development design vetting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-12 text-left">
          
          <div className="sticky top-[var(--header-height,60px)] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 z-40 -mx-6 px-6 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="search"
                placeholder="Search guidelines (e.g., 'parking', 'setbacks', 'school')..."
                className="w-full pl-10 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {filteredSections.map(section => (
            <React.Fragment key={section.id}>
              {section.content}
            </React.Fragment>
          ))}

          {filteredSections.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg font-semibold text-muted-foreground">No guidelines found for "{searchTerm}".</p>
              <p className="text-sm text-muted-foreground mt-2">Try a different search term.</p>
            </div>
          )}
          
        </CardContent>
      </Card>
    </div>
  );
}
