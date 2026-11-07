"use client";

import { useRef, useState, type MouseEvent } from "react";
import { RefreshCw } from "lucide-react";
import type { FormSubmission } from "~/types";
import { cn } from "~/lib/utils";
import {
  AdminEmptyState,
  AdminErrorState,
  AdminLoading,
  AdminPageHeader,
} from "~/components/admin/admin-page";
import {
  ContactActions,
  InboxPagination,
  PAGE_SIZE,
  inboxDate,
  sortInbox,
  useInbox,
} from "~/components/admin/inbox-controls";
import { Badge } from "~/components/ui/badge";
import { ButtonLock } from "~/components/admin/button-lock";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

// Country codes mapping for display
const COUNTRY_NAMES: Record<string, string> = {
  "+93": "Afghanistan",
  "+355": "Albania",
  "+213": "Algeria",
  "+376": "Andorra",
  "+244": "Angola",
  "+1264": "Anguilla",
  "+1268": "Antigua and Barbuda",
  "+54": "Argentina",
  "+374": "Armenia",
  "+297": "Aruba",
  "+61": "Australia",
  "+43": "Austria",
  "+994": "Azerbaijan",
  "+1242": "Bahamas",
  "+973": "Bahrain",
  "+880": "Bangladesh",
  "+1246": "Barbados",
  "+375": "Belarus",
  "+32": "Belgium",
  "+501": "Belize",
  "+229": "Benin",
  "+1441": "Bermuda",
  "+975": "Bhutan",
  "+591": "Bolivia",
  "+387": "Bosnia and Herzegovina",
  "+267": "Botswana",
  "+55": "Brazil",
  "+246": "British Indian Ocean Territory",
  "+673": "Brunei",
  "+359": "Bulgaria",
  "+226": "Burkina Faso",
  "+257": "Burundi",
  "+855": "Cambodia",
  "+237": "Cameroon",
  "+1": "Canada/United States",
  "+238": "Cape Verde",
  "+1345": "Cayman Islands",
  "+236": "Central African Republic",
  "+235": "Chad",
  "+56": "Chile",
  "+86": "China",
  "+57": "Colombia",
  "+269": "Comoros",
  "+242": "Congo",
  "+243": "Congo (DRC)",
  "+682": "Cook Islands",
  "+506": "Costa Rica",
  "+225": "Côte d'Ivoire",
  "+385": "Croatia",
  "+53": "Cuba",
  "+599": "Curaçao",
  "+357": "Cyprus",
  "+420": "Czech Republic",
  "+45": "Denmark",
  "+253": "Djibouti",
  "+1767": "Dominica",
  "+1809": "Dominican Republic",
  "+593": "Ecuador",
  "+20": "Egypt",
  "+503": "El Salvador",
  "+240": "Equatorial Guinea",
  "+291": "Eritrea",
  "+372": "Estonia",
  "+251": "Ethiopia",
  "+298": "Faroe Islands",
  "+679": "Fiji",
  "+358": "Finland",
  "+33": "France",
  "+594": "French Guiana",
  "+689": "French Polynesia",
  "+241": "Gabon",
  "+220": "Gambia",
  "+995": "Georgia",
  "+49": "Germany",
  "+233": "Ghana",
  "+350": "Gibraltar",
  "+30": "Greece",
  "+299": "Greenland",
  "+1473": "Grenada",
  "+590": "Guadeloupe",
  "+1671": "Guam",
  "+502": "Guatemala",
  "+44": "United Kingdom",
  "+224": "Guinea",
  "+245": "Guinea-Bissau",
  "+592": "Guyana",
  "+509": "Haiti",
  "+504": "Honduras",
  "+852": "Hong Kong",
  "+36": "Hungary",
  "+354": "Iceland",
  "+91": "India",
  "+62": "Indonesia",
  "+98": "Iran",
  "+964": "Iraq",
  "+353": "Ireland",
  "+972": "Israel",
  "+39": "Italy",
  "+1876": "Jamaica",
  "+81": "Japan",
  "+962": "Jordan",
  "+7": "Kazakhstan/Russia",
  "+254": "Kenya",
  "+686": "Kiribati",
  "+850": "North Korea",
  "+82": "South Korea",
  "+965": "Kuwait",
  "+996": "Kyrgyzstan",
  "+856": "Laos",
  "+371": "Latvia",
  "+961": "Lebanon",
  "+266": "Lesotho",
  "+231": "Liberia",
  "+218": "Libya",
  "+423": "Liechtenstein",
  "+370": "Lithuania",
  "+352": "Luxembourg",
  "+853": "Macao",
  "+389": "North Macedonia",
  "+261": "Madagascar",
  "+265": "Malawi",
  "+60": "Malaysia",
  "+960": "Maldives",
  "+223": "Mali",
  "+356": "Malta",
  "+692": "Marshall Islands",
  "+596": "Martinique",
  "+222": "Mauritania",
  "+230": "Mauritius",
  "+262": "Mayotte/Réunion",
  "+52": "Mexico",
  "+691": "Micronesia",
  "+373": "Moldova",
  "+377": "Monaco",
  "+976": "Mongolia",
  "+382": "Montenegro",
  "+1664": "Montserrat",
  "+212": "Morocco",
  "+258": "Mozambique",
  "+95": "Myanmar",
  "+264": "Namibia",
  "+674": "Nauru",
  "+977": "Nepal",
  "+31": "Netherlands",
  "+687": "New Caledonia",
  "+64": "New Zealand",
  "+505": "Nicaragua",
  "+227": "Niger",
  "+234": "Nigeria",
  "+683": "Niue",
  "+672": "Norfolk Island",
  "+1670": "Northern Mariana Islands",
  "+47": "Norway",
  "+968": "Oman",
  "+92": "Pakistan",
  "+680": "Palau",
  "+970": "Palestine",
  "+507": "Panama",
  "+675": "Papua New Guinea",
  "+595": "Paraguay",
  "+51": "Peru",
  "+63": "Philippines",
  "+48": "Poland",
  "+351": "Portugal",
  "+1787": "Puerto Rico",
  "+974": "Qatar",
  "+40": "Romania",
  "+250": "Rwanda",
  "+290": "Saint Helena",
  "+1869": "Saint Kitts and Nevis",
  "+1758": "Saint Lucia",
  "+508": "Saint Pierre and Miquelon",
  "+1784": "Saint Vincent and the Grenadines",
  "+685": "Samoa",
  "+378": "San Marino",
  "+239": "São Tomé and Príncipe",
  "+966": "Saudi Arabia",
  "+221": "Senegal",
  "+381": "Serbia",
  "+248": "Seychelles",
  "+232": "Sierra Leone",
  "+65": "Singapore",
  "+1721": "Sint Maarten",
  "+421": "Slovakia",
  "+386": "Slovenia",
  "+677": "Solomon Islands",
  "+252": "Somalia",
  "+27": "South Africa",
  "+500": "South Georgia",
  "+211": "South Sudan",
  "+34": "Spain",
  "+94": "Sri Lanka",
  "+249": "Sudan",
  "+597": "Suriname",
  "+268": "Eswatini",
  "+46": "Sweden",
  "+41": "Switzerland",
  "+963": "Syria",
  "+886": "Taiwan",
  "+992": "Tajikistan",
  "+255": "Tanzania",
  "+66": "Thailand",
  "+670": "Timor-Leste",
  "+228": "Togo",
  "+690": "Tokelau",
  "+676": "Tonga",
  "+1868": "Trinidad and Tobago",
  "+216": "Tunisia",
  "+90": "Turkey",
  "+993": "Turkmenistan",
  "+1649": "Turks and Caicos Islands",
  "+688": "Tuvalu",
  "+256": "Uganda",
  "+380": "Ukraine",
  "+971": "United Arab Emirates",
  "+598": "Uruguay",
  "+998": "Uzbekistan",
  "+678": "Vanuatu",
  "+58": "Venezuela",
  "+84": "Vietnam",
  "+1284": "British Virgin Islands",
  "+1340": "U.S. Virgin Islands",
  "+681": "Wallis and Futuna",
  "+967": "Yemen",
  "+260": "Zambia",
  "+263": "Zimbabwe",
};

function countryName(code?: string) {
  if (!code) return "—";
  return COUNTRY_NAMES[code] || code;
}

export default function FormSubmissions() {
  const {
    records: submissions,
    loading,
    error,
    actionError,
    notice,
    busyId,
    refresh,
    update,
  } = useInbox<FormSubmission>("/api/form-submissions");
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);
  const openerRef = useRef<HTMLTableRowElement | null>(null);
  const active = submissions.find((item) => item._id === activeId);
  const ordered = sortInbox(submissions, "newest");
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(ordered.length / PAGE_SIZE)),
  );
  const visible = ordered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const disabled = loading || busyId !== null;

  function openDetails(item: FormSubmission, row: HTMLTableRowElement) {
    openerRef.current = row;
    setActiveId(item._id);
  }
  function openFromRow(
    event: MouseEvent<HTMLTableRowElement>,
    item: FormSubmission,
  ) {
    const target = event.target;
    if (target instanceof Element && target.closest("button, [role='switch']"))
      return;
    openDetails(item, event.currentTarget);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Demo requests"
        description="Follow up with families, one conversation at a time."
      >
        <ButtonLock
          locked={!loading && busyId !== null}
          reason="Wait until the current change finishes saving."
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => void refresh()}
            disabled={disabled}
          >
            <RefreshCw
              aria-hidden="true"
              className={loading ? "animate-spin" : ""}
            />
            {loading ? "Refreshing" : "Refresh"}
          </Button>
        </ButtonLock>
      </AdminPageHeader>

      {error && (
        <AdminErrorState message={error} onRetry={() => void refresh()} />
      )}
      {actionError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {actionError}
        </div>
      )}
      <p role="status" className="sr-only">
        {notice}
      </p>

      {loading && !submissions.length ? (
        <AdminLoading
          label="Loading demo requests…"
          variant="table"
          columns={6}
        />
      ) : !error && !ordered.length ? (
        <AdminEmptyState
          title="No demo requests yet"
          description="New requests from the demo form will appear here."
        />
      ) : ordered.length > 0 ? (
        <Card className="overflow-hidden">
          <section aria-label="Demo requests" aria-busy={loading}>
            <Table className="min-w-[52rem] table-fixed">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[16%] pl-4" scope="col">
                    Name
                  </TableHead>
                  <TableHead className="w-[20%]" scope="col">
                    Email
                  </TableHead>
                  <TableHead className="w-[14%]" scope="col">
                    Number
                  </TableHead>
                  <TableHead className="w-[14%]" scope="col">
                    Country
                  </TableHead>
                  <TableHead className="w-[22%]" scope="col">
                    Contacted
                  </TableHead>
                  <TableHead className="w-[14%] pr-4" scope="col">
                    Received
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((item) => (
                  <TableRow
                    key={item._id}
                    tabIndex={0}
                    className={cn(
                      "cursor-pointer focus-visible:bg-admin-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-admin-ring",
                      !item.contacted && "bg-admin-primary/[0.04]",
                    )}
                    aria-label={`Open request from ${item.name}`}
                    onClick={(event) => openFromRow(event, item)}
                    onKeyDown={(event) => {
                      if (event.target !== event.currentTarget) return;
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      openDetails(item, event.currentTarget);
                    }}
                  >
                    <TableCell className="py-3 pl-4">
                      <p
                        className={
                          item.contacted
                            ? "truncate text-sm font-medium"
                            : "truncate text-sm font-semibold"
                        }
                        title={item.name}
                      >
                        {item.name}
                      </p>
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="truncate text-sm" title={item.email}>
                        {item.email}
                      </p>
                    </TableCell>
                    <TableCell className="py-3">
                      <p
                        className="truncate text-sm"
                        title={item.contactNumber}
                      >
                        {item.contactNumber}
                      </p>
                    </TableCell>
                    <TableCell className="py-3">
                      <p
                        className="truncate text-sm"
                        title={countryName(item.countryCode)}
                      >
                        {countryName(item.countryCode)}
                      </p>
                    </TableCell>
                    <TableCell
                      className="py-3"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.contacted === true}
                          disabled={disabled}
                          onCheckedChange={() =>
                            void update(item._id, "contacted")
                          }
                          aria-label={`Mark ${item.name} as ${item.contacted ? "non contacted" : "contacted"}`}
                        />
                        <span className="whitespace-nowrap text-xs text-admin-muted-foreground">
                          {item.contacted ? "Contacted" : "Non contacted"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-3 pr-4 text-xs text-admin-muted-foreground">
                      <time dateTime={item.createdAt}>
                        {inboxDate(item.createdAt)}
                      </time>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {ordered.length > PAGE_SIZE && (
              <div className="px-4 pb-3">
                <InboxPagination
                  page={currentPage}
                  total={ordered.length}
                  onChange={setPage}
                />
              </div>
            )}
          </section>
        </Card>
      ) : null}

      <Dialog
        open={Boolean(active)}
        onOpenChange={(open) => {
          if (!open) setActiveId(null);
        }}
      >
        <DialogContent
          className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl grid-cols-[minmax(0,1fr)] overflow-y-auto [&>*]:min-w-0"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            openerRef.current?.focus();
          }}
        >
          {active && (
            <>
              <DialogHeader className="pr-6">
                <DialogTitle className="break-words">{active.name}</DialogTitle>
                <DialogDescription>
                  Demo request · {inboxDate(active.createdAt, true)}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    active.contacted
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-orange-200 bg-orange-50 text-orange-800"
                  }
                >
                  {active.contacted ? "Contacted" : "Non contacted"}
                </Badge>
                {active.countryCode && (
                  <span className="text-sm text-admin-muted-foreground">
                    {COUNTRY_NAMES[active.countryCode] || active.countryCode}
                  </span>
                )}
              </div>
              <ContactActions
                key={active._id}
                email={active.email}
                phone={active.contactNumber}
                countryCode={active.countryCode}
              />
              <section aria-label="Request message" className="space-y-2">
                <h3 className="text-sm font-semibold">Message</h3>
                <p className="whitespace-pre-wrap break-words rounded-lg bg-admin-muted p-4 text-sm leading-7">
                  {active.message || "No message provided."}
                </p>
              </section>
              {actionError && (
                <p role="alert" className="text-sm text-red-700">
                  {actionError}
                </p>
              )}
              <p role="status" className="text-xs text-admin-muted-foreground">
                {busyId === active._id ? "Saving contact status…" : notice}
              </p>
              <DialogFooter className="gap-2">
                <ButtonLock
                  locked={disabled}
                  reason={
                    loading
                      ? "Results are still loading."
                      : "Wait until the current change finishes saving."
                  }
                >
                  <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    onClick={() => void update(active._id, "contacted")}
                  >
                    Mark as {active.contacted ? "non contacted" : "contacted"}
                  </Button>
                </ButtonLock>
                <DialogClose asChild>
                  <Button>Done</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
